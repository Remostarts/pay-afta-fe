'use client';

export default function Social() {
  return (
    <div className="p-8">
      <h3 className="mb-4 text-xl font-semibold">Social</h3>
      <div className="mx-auto max-w-xl rounded-lg border bg-white p-8">
        <div className="mb-4">
          <p className="mb-1 block font-medium">Instagram Username</p>
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="www.Instagram.com/"
            readOnly
          />
        </div>
        <div className="mb-4">
          <p className="mb-1 block font-medium">Facebook Username</p>
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="www.facebook.com/"
            readOnly
          />
        </div>
        <div className="mb-4">
          <p className="mb-1 block font-medium">Twitter Username</p>
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="www.Twitter.com/"
            readOnly
          />
        </div>
        <div>
          <p className="mb-1 block font-medium">Tiktok Username</p>
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="www.Tiktok.com/"
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
