import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdmissionForm from '../Pages/AdmissionForm';


const AdmissionFormDashboard: React.FC = () => {
  

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
           <AdmissionForm/>
        </div>
    );
};

export default AdmissionFormDashboard;
