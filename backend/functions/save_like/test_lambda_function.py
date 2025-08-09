import os
import json
import uuid
import importlib.util
from types import SimpleNamespace

# --- Test helpers -----------------------------------------------------------

def _load_lambda_module(fake_table=None, fixed_ts="2025-08-08T12:00:00Z"):
    """Dynamically load the lambda_function.py that sits next to this test file.
    We set TABLE_NAME and then override TABLE + _iso_now so no real AWS calls happen.
    """
    here = os.path.dirname(__file__)
    path = os.path.join(here, "lambda_function.py")

    # Ensure env var exists at import time (module reads TABLE_NAME during import)
    os.environ.setdefault("TABLE_NAME", "DummyTableForTests")

    # Load the module under a unique name so each test gets a clean module state
    mod_name = f"lambda_under_test_{uuid.uuid4().hex}"
    spec = importlib.util.spec_from_file_location(mod_name, path)
    mod = importlib.util.module_from_spec(spec)
    assert spec and spec.loader, "Could not load lambda_function.py"
    spec.loader.exec_module(mod)  # type: ignore

    # Override dynamo table and clock
    if fake_table is not None:
        mod.TABLE = fake_table
    mod._iso_now = lambda: fixed_ts  # deterministic timestamps
    return mod


class FakeTable:
    """A simple fake that captures the last put_item() call.
    If raise_conditional=True, it simulates a ConditionalCheckFailedException.
    """
    def __init__(self, raise_conditional=False):
        self.raise_conditional = raise_conditional
        self.last_item = None
        self.last_condition = None

    def put_item(self, Item=None, ConditionExpression=None, **kwargs):
        self.last_item = Item
        self.last_condition = ConditionExpression
        if self.raise_conditional:
            from botocore.exceptions import ClientError
            raise ClientError(
                {
                    "Error": {
                        "Code": "ConditionalCheckFailedException",
                        "Message": "Item already exists"
                    }
                },
                "PutItem",
            )
        return {"ResponseMetadata": {"HTTPStatusCode": 200}}


# --- Tests ------------------------------------------------------------------

def test_success_creates_like_and_returns_201():
    table = FakeTable()
    mod = _load_lambda_module(fake_table=table, fixed_ts="2025-08-08T12:00:00Z")

    event = {
        "httpMethod": "POST",
        "body": json.dumps({
            "userId": "u123",
            "meal": {
                "id": "m456",
                "name": "Pad Thai",
                "image": "https://ex/img.jpg",
                "ingredients": [f"i{i}" for i in range(15)],  # test truncation to 10
            }
        })
    }

    resp = mod.lambda_handler(event, None)

    # Response assertions
    assert resp["statusCode"] == 201
    headers = resp["headers"]
    assert headers["Access-Control-Allow-Origin"] == "*"
    assert "POST" in headers["Access-Control-Allow-Methods"]

    # Dynamo write assertions
    item = table.last_item
    assert item is not None
    # Keys
    assert item["PK"] == "USER#u123"
    assert item["SK"].startswith("LIKE#") and item["SK"].endswith("m456")
    assert item["GSI1PK"] == "MEAL#m456"
    assert item["GSI1SK"] == "USER#u123"
    assert item["GSI2PK"] == "USER#u123"
    assert item["GSI2SK"] == "2025-08-08T12:00:00Z#LIKE#m456"

    # Denormalized fields
    assert item["mealId"] == "m456"
    assert item["mealName"] == "Pad Thai"
    assert item["imageUrl"] == "https://ex/img.jpg"
    assert item["ingredients"] == [f"i{i}" for i in range(10)]  # truncated
    assert item["likedAt"] == "2025-08-08T12:00:00Z"
    assert item["updatedAt"] == "2025-08-08T12:00:00Z"
    assert item["source"] == "themealdb"

    # Condition expression ensures idempotency
    assert table.last_condition == "attribute_not_exists(PK) AND attribute_not_exists(SK)"


def test_duplicate_like_returns_200_duplicate_true():
    table = FakeTable(raise_conditional=True)
    mod = _load_lambda_module(fake_table=table)

    event = {
        "httpMethod": "POST",
        "body": json.dumps({
            "user_id": "u123",  # alternate field naming supported
            "meal": {"mealId": "m456"}
        })
    }
    resp = mod.lambda_handler(event, None)

    assert resp["statusCode"] == 200
    body = json.loads(resp["body"])
    assert body["ok"] is True and body.get("duplicate") is True


def test_missing_user_id_returns_400():
    table = FakeTable()
    mod = _load_lambda_module(fake_table=table)

    event = {"httpMethod": "POST", "body": json.dumps({"meal": {"id": "m1"}})}
    resp = mod.lambda_handler(event, None)

    assert resp["statusCode"] == 400
    body = json.loads(resp["body"])
    assert body["ok"] is False
    assert "userId is required" in body["error"]


def test_missing_meal_id_returns_400():
    table = FakeTable()
    mod = _load_lambda_module(fake_table=table)

    event = {"httpMethod": "POST", "body": json.dumps({"userId": "u1", "meal": {}})}
    resp = mod.lambda_handler(event, None)

    assert resp["statusCode"] == 400
    body = json.loads(resp["body"])
    assert body["ok"] is False
    assert "meal.id is required" in body["error"]


def test_accepts_alternate_meal_fields():
    table = FakeTable()
    mod = _load_lambda_module(fake_table=table)

    event = {
        "httpMethod": "POST",
        "body": json.dumps({
            "userId": "u123",
            "meal": {
                "mealId": "m789",
                "mealName": "Ramen",
                "imageUrl": "https://ex/ramen.jpg",
                "ingredients": ["a", "b"]
            }
        })
    }
    resp = mod.lambda_handler(event, None)
    assert resp["statusCode"] in (200, 201)

    item = table.last_item
    assert item["mealId"] == "m789"
    assert item["mealName"] == "Ramen"
    assert item["imageUrl"] == "https://ex/ramen.jpg"