// Gives the right address for a gallery photo.
// - New photos are stored on Cloudinary (the link starts with "http").
//   We ask Cloudinary to pick the best format and quality automatically.
// - Older photos are still on the backend server (link starts with "/uploads"),
//   so they get the backend address in front.
export const getImageUrl = (url, baseUrl, width) => {
  if (!url) return "";

  if (url.startsWith("http")) {
    if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
      const options = width ? `f_auto,q_auto,w_${width}` : "f_auto,q_auto";
      return url.replace("/upload/", `/upload/${options}/`);
    }
    return url;
  }

  return `${baseUrl}${url}`;
};