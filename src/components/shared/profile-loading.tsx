import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <Skeleton className="h-8 w-32" />
            <Card className="overflow-hidden">
                <Skeleton className="h-24 w-full rounded-none" />
                <CardContent className="-mt-12 flex flex-col gap-6">
                    <div className="flex items-end gap-4">
                        <Skeleton className="size-24 rounded-full" />
                        <div className="flex flex-col gap-2 pb-1">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}