# TO DEPLOY RUN THE FOLLOWING COMMAND
# bash deploy.sh {function_name}

FUNCTION_NAME=$1
ZIP_FILE="$FUNCTION_NAME.zip"
SOURCE_DIR="./functions/$FUNCTION_NAME"
BUILD_DIR="./build/$FUNCTION_NAME"

echo "📦 Installing dependencies..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"
pip install -r requirements.txt -t "$BUILD_DIR"

echo "📁 Copying source code..."
cp "$SOURCE_DIR"/* "$BUILD_DIR"/

echo "🧹 Cleaning old ZIP..."
rm -f "$ZIP_FILE"

echo "📁 Zipping deployment package..."
cd "$BUILD_DIR"
zip -r9 "../../$ZIP_FILE" .
cd ../..

echo "⬆️ Uploading to Lambda..."
RESPONSE=$(aws lambda update-function-code \
  --function-name "Dishr_$FUNCTION_NAME" \
  --zip-file "fileb://$ZIP_FILE" \
  --region us-east-1 \
  --profile default) || exit 1

echo "✅ Successfully deployed $FUNCTION_NAME to AWS Lambda"
echo "🔍 Function ARN: $(echo "$RESPONSE" | jq -r '.FunctionArn')"