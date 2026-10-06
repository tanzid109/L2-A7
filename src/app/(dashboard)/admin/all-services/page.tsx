import ServiceTable from '@/components/modules/admin/service-table';
import ServiceTableLoading from '@/components/modules/admin/service-table-loading';
import React, { Suspense } from 'react';

const AllServices = () => {
    return (
        <Suspense fallback={<ServiceTableLoading />}>
            <ServiceTable />
        </Suspense>
    );
};

export default AllServices;