"use client";

import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllServices } from "@/hooks";
import { ServiceParams } from "@/types";

export default function ServiceCards(params: ServiceParams) {
    const { data, isPending, isError } = useGetAllServices(params);

    if (isPending) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-80 w-full" />
                ))}
            </div>
        );
    }

    if (isError) {
        return <p className="text-sm text-destructive">Could not load services</p>;
    }

    const services = data.data.data;

    if (services.length === 0) {
        return <p className="text-sm text-muted-foreground">No services found</p>;
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
                <Card key={service.id} className="overflow-hidden pt-0">
                    <div className="relative aspect-video w-full bg-muted">
                        {service.imageUrl && (
                            // biome-ignore lint/performance/noImgElement: simple card image
                            <img
                                src={service.imageUrl}
                                alt={service.title}
                                className="size-full object-cover"
                            />
                        )}
                        <Badge
                            variant={service.isActive ? "default" : "secondary"}
                            className="absolute right-3 top-3"
                        >
                            {service.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>

                    <CardHeader>
                        <Badge variant="outline" className="w-fit">
                            {service.category}
                        </Badge>
                        <CardTitle className="line-clamp-1">{service.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                            {service.description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex items-center justify-between">
                        <span className="text-lg font-bold">
                            {Number(service.price).toLocaleString()} BDT
                        </span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="size-4" />
                            {service.duration} min
                        </span>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}