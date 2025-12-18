export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Placeholder cards */}
                <div className="overflow-hidden rounded-lg bg-white shadow px-4 py-5 sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Total Tasks</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">0</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white shadow px-4 py-5 sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Completed</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">0</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white shadow px-4 py-5 sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Pending</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-yellow-600">0</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white shadow px-4 py-5 sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Overdue</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-red-600">0</dd>
                </div>
            </div>

            {/* Recent Tasks */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">My Assigned Tasks</h3>
                        <div className="mt-4 text-center text-sm text-gray-500 py-8">
                            No tasks assigned yet.
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Tasks I Created</h3>
                        <div className="mt-4 text-center text-sm text-gray-500 py-8">
                            No tasks created yet.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
