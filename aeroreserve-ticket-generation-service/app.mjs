/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
import { v4 as uuidv4 } from 'uuid';

export const lambdaHandler = async (event, context) => {
  // Generate a unique ticket ID for each request
  const ticketId = uuidv4();

  // Construct the response object with the generated ticket ID
  const response = {
      statusCode: 200,
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          ticketId: ticketId
      })
  };

  return response;
};
  