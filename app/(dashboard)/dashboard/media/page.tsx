import db from "@/lib/db";
import MediaGallery from "./_components/media-gallery";

const MediaPage = async () => {
    const mediaPromise = db.media.findMany();

    return <MediaGallery mediaPromise={mediaPromise} />;
};

export default MediaPage;
