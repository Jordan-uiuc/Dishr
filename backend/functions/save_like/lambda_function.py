import os, json, datetime, boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
TABLE = dynamodb.Table(os.environ["TABLE_NAME"])


def _iso_now():
    """
    Returns:
        str: The current UTC time as an ISO 8601 formatted string (e.g., '2024-06-11T14:23:45Z').
    """
    return datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds") + "Z"

"""
    Extracts the user ID from the provided event body dictionary.

    Attempts to retrieve the user ID using either the "userId" or "user_id" key.
    Raises a ValueError if neither key is present or the value is falsy.

    Args:
        event_body (dict): The event body containing user information.

    Returns:
        str: The extracted user ID.

    Raises:
        ValueError: If the user ID is not found in the event body.
    """
def _extract_user_id(event_body: dict) -> str:
    
    user_id = event_body.get("userId") or event_body.get("user_id")
    if not user_id:
        raise ValueError("userId is required")
    return user_id

def lambda_handler(event, context):
    """
    AWS Lambda function to save a 'like' record for a meal by a user.

    Parses the incoming event to extract user and meal information, constructs
    a DynamoDB item representing the 'like', and attempts to insert it into the table.
    Ensures idempotency by returning success if the like already exists.

    Args:
        event (dict): The event payload containing the request body.
        context (LambdaContext): The runtime information of the Lambda function.

    Returns:
        dict: HTTP response with status code and result indicating success, duplicate, or error.

    Raises:
        ValueError: If required meal ID is missing from the request.
    """
    try:
        body = json.loads(event.get("body") or "{}")

        user_id = _extract_user_id(body)
        meal = body.get("meal") or {}
        meal_id = str(meal.get("id") or meal.get("mealId") or "").strip()
        if not meal_id:
            raise ValueError("meal.id is required")

        meal_name = meal.get("name") or meal.get("mealName")
        image_url = meal.get("image") or meal.get("imageUrl")
        ingredients = meal.get("ingredients") or []

        # build keys
        ts = _iso_now()
        pk = f"USER#{user_id}"
        sk = f"LIKE#{meal_id}"                # <- sort key is the like record
        gsi1pk = f"MEAL#{meal_id}"            # ByMeal index PK
        gsi1sk = f"USER#{user_id}"            # ByMeal index SK
        gsi2pk = f"USER#{user_id}"            # ByUserLikedAt index PK
        gsi2sk = f"{ts}#LIKE#{meal_id}"       # time-first for chronological order

        item = {
            "PK": pk,
            "SK": sk,
            "GSI1PK": gsi1pk,
            "GSI1SK": gsi1sk,
            "GSI2PK": gsi2pk,
            "GSI2SK": gsi2sk,

            # denormalized fields
            "mealId": meal_id,
            "mealName": meal_name,
            "imageUrl": image_url,
            "ingredients": ingredients[:10],
            "likedAt": ts,
            "updatedAt": ts,
            "source": meal.get("source") or "themealdb",
        }

        TABLE.put_item(
            Item=item,
            ConditionExpression="attribute_not_exists(PK) AND attribute_not_exists(SK)"
        )

        return _resp(201, {"ok": True})

    except ClientError as e:
        if e.response.get("Error", {}).get("Code") == "ConditionalCheckFailedException":
            # already liked; idempotent success
            return _resp(200, {"ok": True, "duplicate": True})
        return _resp(500, {"ok": False, "error": str(e)})

    except Exception as e:
        return _resp(400, {"ok": False, "error": str(e)})

def _resp(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            # dev CORS; tighten later
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
        },
        "body": json.dumps(body),
    }