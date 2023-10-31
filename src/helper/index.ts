const isVerificationType = (url: string, value: string) => url.includes(value);

export const getPlatformTypeByURL = (url: string) => {
    console.log("% % % % % % % __>  URL (/save-url -> parsePage)  <__% % % % % % % ", url);
        const resultType = isVerificationType(url, "djinni.co")
        ? "djinni"
        : isVerificationType(url, "jobs.dou.ua")
            ? "dou"
            : isVerificationType(url, "robota.ua")
                ? "robota"
                : isVerificationType(url, "work.ua")
                    ? "work" 
                    : "other"
    return resultType;
}

export const defaultLogoSrc = "https://www.logolynx.com/images/logolynx/26/2651ed332aad0a6eb1e1f75319cd87b4.jpeg";

export const getValidLogoCompanySrc = (srcImage: string) => {
    const result = srcImage?.includes("https://")
        ? srcImage
        : defaultLogoSrc
    return result;
}