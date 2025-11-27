'use server';
export const getNewAccessToken = async (refreshToken: string) => {
  try {
    const res = await fetch(`${process.env.BACKEND_URLL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('❌ Token refresh error:', error.message);
    throw new Error(error.message);
  }
};
