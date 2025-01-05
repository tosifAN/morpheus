import React from 'react';
import { useParams } from 'react-router-dom';
import Analytics from '../components/Admin/Analytics';

const AnalyticsPage = () => {
  const { formId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <Analytics formId={formId} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
