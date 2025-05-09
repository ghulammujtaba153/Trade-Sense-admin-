import React from 'react';
import ModuleModal from './ModuleModal';
import CourseSection from './CourseSection';
import GoalsSection from './GoalsSection';

const UserDetailSection = ({ enrollments }) => {

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Courses</h1>
        <CourseSection enrollments={enrollments}/>

        <GoalsSection />
      
    </div>
  );
};

export default UserDetailSection;
