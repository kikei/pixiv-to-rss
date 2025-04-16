import * as t from 'io-ts';
import {
  SSMClient, GetParameterCommand
} from '@aws-sdk/client-ssm'

export class TraderParameterException extends Error {}

const tTraderParameter = t.type({
  pixiv: t.type({
    refreshToken: t.string
  })
});

type TraderParameter = t.TypeOf<typeof tTraderParameter>;

export async function loadParameter({parameterStoreId}: {
  parameterStoreId: string
}): Promise<TraderParameter> {
  const client = new SSMClient({})
  const response = await client.send(new GetParameterCommand({
    Name: parameterStoreId
  }))
  if (response.Parameter?.Value === undefined)
    throw new TraderParameterException(
      `Failed to get trader parameters, parameterStoreId: ${parameterStoreId}`
    );
  try {
    const obj = JSON.parse(response.Parameter.Value);
    if (!tTraderParameter.is(obj))
      throw new TraderParameterException(
        `Failed to loader parameters, parameterStoreId: ${parameterStoreId}`
      );
    return obj;
  } catch (e) {
    throw new TraderParameterException(
      `Failed to parse trader parameters, parameterStoreId: ${parameterStoreId}`
    );
  }
}
