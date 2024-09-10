import React from 'react';
import AdmissionForm from '../Pages/AdmissionForm';

// Renaming the local component to avoid naming conflict
const AdmissionFormDashboard = () => {  
    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
           <AdmissionForm />
        </div>
    );
};

export default AdmissionFormDashboard;
