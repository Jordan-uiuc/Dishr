import json
import urllib.request

def lambda_handler(event, context):
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