/** Resolves a public-folder path against the deploy base URL. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
