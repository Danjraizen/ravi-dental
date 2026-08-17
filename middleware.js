export default function middleware(request) {
  const url = new URL(request.url);

  if (url.hostname === "mogappairdentalclinic.com") {
    url.hostname = "www.mogappairdentalclinic.com";
    return Response.redirect(url, 308);
  }
}

export const config = {
  matcher: "/:path*"
};
