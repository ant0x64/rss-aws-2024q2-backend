import { APIGatewayProxyResult } from "aws-lambda";

export const createResponse = (status: number = 200, body = {}): APIGatewayProxyResult => {
  return {
    statusCode: status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
};
