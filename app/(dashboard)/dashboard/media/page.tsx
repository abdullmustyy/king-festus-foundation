import { getUserMediaCount } from "@/app/actions/cms/media";
import { UserRole } from "@/generated/prisma/enums";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import MediaGallery from "./_components/media-gallery";

const MediaPage = async () => {
    const user = await currentUser();
    let isAdmin = false;
    let mediaCount = 0;

    if (user) {
        const dbUser = await db.user.findUnique({
            where: { id: user.id },
            select: { role: true },
        });

        isAdmin = dbUser?.role === UserRole.ADMIN || dbUser?.role === UserRole.SUPER_ADMIN;
        mediaCount = await getUserMediaCount(user.id);
    }

    const mediaPromise = db.media.findMany({
        include: {
            mediaAsset: true,
        },
    });

    return (
        <MediaGallery mediaPromise={mediaPromise} isAdmin={isAdmin} mediaCount={mediaCount} currentUserId={user?.id} />
    );
};

export default MediaPage;
