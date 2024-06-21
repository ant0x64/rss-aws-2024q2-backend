import { APIGatewayProxyHandler } from "aws-lambda";
import { createResponse } from "~/utils/lambda";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    const file_name = event.queryStringParameters?.name;

    if (!file_name) {
      return createResponse(400, { message: "File name not specified" });
    }

    const bucket_name = process.env.BUCKET_IMPORT_NAME;
    const uploaded_key = process.env.BUCKET_IMPORT_UPLOADED_NAME;

    if (!bucket_name || !uploaded_key) {
      return createResponse(500, { message: "Bad configuration" });
    }

    const url = getSignedUrl(
      new S3Client(),
      new PutObjectCommand({
        Bucket: bucket_name,
        Key: `${uploaded_key}/${file_name}`,
      }),
      { expiresIn: 3600 }
    );

    return createResponse(200, { url });
  } catch (e) {
    return createResponse(500);
  }
};
