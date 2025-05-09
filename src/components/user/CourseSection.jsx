import React, { useState } from "react";
import ModuleModal from "./ModuleModal";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const CourseSection = ({ enrollments }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);

  const handleCardClick = (modules) => {
    setSelectedModules(modules);
    setIsModalOpen(true);
  };
  return (
    <div>
      <div className="flex flex-wrap gap-6">
        {enrollments?.length > 0 ? (
          enrollments.map((enrollment) => {
            const { _id, course, instructor, plan } = enrollment;

            return (
              <div
                key={_id}
                onClick={() => handleCardClick(course.modules)}
                className="w-[300px] bg-white shadow-md rounded-2xl overflow-hidden border hover:shadow-lg cursor-pointer transition duration-300"
              >
                <img
                  src={course?.thumbnail}
                  alt={course?.title}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {course?.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {course?.description || "No description available."}
                  </p>

                  <div className="my-2 flex items-end justify-end">
                    <p className="inline-block text-sm text-white px-3 py-1 rounded-full bg-primary">
                      {enrollment.status}
                    </p>
                  </div>

                  <p className="inline-block text-sm text-white px-3 py-1 rounded-full bg-primary">
                    {plan?.name}
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 border-t">
                  {instructor?.profilePicture ? (
                    <img
                      src={instructor.profilePicture}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-10 h-10 text-gray-400" />
                  )}

                  <div>
                    <p className="text-sm font-bold text-black">
                      {instructor?.name || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">Instructor</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No enrollments found.</p>
        )}
      </div>

      <ModuleModal
        modules={selectedModules}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CourseSection;
