import React from 'react';

const HelpCenter: React.FC = () => {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-label-md text-on-surface-variant font-medium tracking-wide uppercase text-xs mb-2 block">User Guide</span>
          <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">
            Help Center
          </h2>
          <p className="text-on-surface-variant mt-2 max-w-lg">
            Welcome to the Task Manager help center. Find everything you need to get started and manage your support requests effectively.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-surface-container-low p-6 rounded-2xl ghost-border space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <span className="material-symbols-outlined">add_circle</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">Creating Tickets</h3>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            To create a new support request, click the <span className="font-semibold text-on-surface">"New Ticket"</span> button in the sidebar. Provide a descriptive title and a detailed description of the issue to help the technicians assist you quickly.
          </p>
        </section>

        <section className="bg-surface-container-low p-6 rounded-2xl ghost-border space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <span className="material-symbols-outlined">view_list</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">Viewing Status</h3>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Navigate to the <span className="font-semibold text-on-surface">"Tickets"</span> page to see a list of all your active requests. Each ticket shows its current status: <span className="text-primary font-bold">Open</span>, <span className="text-primary font-bold">Pending</span>, or <span className="text-primary font-bold">Resolved</span>.
          </p>
        </section>

        <section className="bg-surface-container-low p-6 rounded-2xl ghost-border space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <span className="material-symbols-outlined">group</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">Team Management</h3>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Administrators can manage the team by visiting the <span className="font-semibold text-on-surface">"Team"</span> section. Here you can add new members and assign roles to ensure tasks are routed to the correct person.
          </p>
        </section>

        <section className="bg-surface-container-low p-6 rounded-2xl ghost-border space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <span className="material-symbols-outlined">domain</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">Departments</h3>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Organize your tickets by department to streamline routing. Use the <span className="font-semibold text-on-surface">"Departments"</span> page to create and modify organizational units and their unique codes.
          </p>
        </section>
      </div>
    </div>
  );
};

export default HelpCenter;
