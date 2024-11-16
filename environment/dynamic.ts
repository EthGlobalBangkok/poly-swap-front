if (process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID === undefined) throw Error('DYNAMIC_ENV is undefined');

export const dynamicEnvId = process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID;