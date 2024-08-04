export async function POST() {
  return Response.json(
    {
      message: 'Buộc đăng xuất thành công',
    },
    {
      status: 200,
      headers: {
        // Xóa cookie sessionToken
        'Set-Cookie': `token=; Path=/; HttpOnly; Max-Age=0`,
      },
    }
  );
}
