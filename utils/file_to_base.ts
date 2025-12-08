export function base64ToFile(base64: string, fileName: string): File {
  const matches = base64.match(/^data:(.+);base64,(.*)$/);
  const mime = matches ? matches[1] : "application/octet-stream";
  const data = matches ? matches[2] : base64;

  const byteString = atob(data);
  const arrayBuffer = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    arrayBuffer[i] = byteString.charCodeAt(i);
  }

  return new File([arrayBuffer], fileName, { type: mime });
}
