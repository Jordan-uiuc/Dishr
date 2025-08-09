import json
import urllib.request

def lambda_handler(event, context):
    """
    AWS Lambda function to fetch a random recipe from TheMealDB API and return its details.

    Args:
        event (dict): The event data passed to the Lambda function.
        context (LambdaContext): The runtime information of the Lambda function.

    Returns:
        dict: A response object containing:
            - statusCode (int): HTTP status code (200 for success, 500 for error).
            - headers (dict): CORS headers for cross-origin requests.
            - body (str): JSON string with recipe details or error message.
                On success, includes:
                    - id (str): Meal ID.
                    - name (str): Meal name.
                    - image (str): URL to the meal image.
                    - instructions (str): Cooking instructions.
                    - ingredients (list): List of ingredient dicts with 'name' and 'measure'.
                On error, includes:
                    - error (str): Error message.
    """
    try:
        url = "https://www.themealdb.com/api/json/v1/1/random.php"
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read())

        raw = data["meals"][0]
        ingredients = []

        for i in range(1, 21):
            ingredient = raw.get(f"strIngredient{i}")
            measure = raw.get(f"strMeasure{i}")
            if ingredient and ingredient.strip():
                ingredients.append({
                    "name": ingredient,
                    "measure": measure
                })

        return {
            "statusCode": 200,
            "headers": { 
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            "body": json.dumps({
                "id": raw["idMeal"],
                "name": raw["strMeal"],
                "image": raw["strMealThumb"],
                "instructions": raw["strInstructions"],
                "ingredients": ingredients
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({ "error": str(e) })
        }