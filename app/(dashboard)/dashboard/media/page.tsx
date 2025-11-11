import { utapi } from "@/app/api/uploadthing/core";
import MediaGallery from "./_components/media-gallery";

const MediaPage = async () => {
    const gallery = (await utapi.listFiles()).files;

    return <MediaGallery gallery={gallery} />;
};

export default MediaPage;
