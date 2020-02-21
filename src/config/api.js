export const APILINK = " https://pyxis.azure-api.net/project";
// export const APILINK = "https://smb2-project-management.pyxispm.com/api";
export const HOMEURL = "http://dev.roman3.io/image";
// export const HOMEURL = "http://localhost:3000";
export const TEMPLATEURL = HOMEURL + "/templates";

export const URI = {
  SAVEDESIGN: "/api/project/",
  LOADDESIGN: "/api/project/",
}

export const METHOD = {
  PUT: "PUT",
  GET: "GET",
  POST: "POST",
  DEL: "DEL"
}

export const HEADERS = {
  CONTENTTYPE: "application/json", 
  TOKEN: localStorage.getItem('id_token'),
  "Ocp-Apim-Subscription-Key": "81e4593537654e509521bf718eec149e"
}