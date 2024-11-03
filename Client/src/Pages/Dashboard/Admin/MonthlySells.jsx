import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const MonthlySells = () => {
    const date = new Date();
    const year = date.getFullYear();
    
    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2",
        title:{
            text: `Monthly Sales Data ${year}`
        },
        axisX: {
            interval: 1,
            title: "Months"
        },
        axisY: {
            title: "Sales",
            includeZero: true
        },
        data: [{
            type: "column",
            indexLabelFontColor: "#5A5757",
            indexLabelPlacement: "outside",
            dataPoints: [
                { label: "January", y: 539 },
                { label: "February", y: 1469 },
                { label: "March", y: 1964 },
                { label: "April", y: 365 },
                { label: "May", y: 2724,indexLabel: "Highest" },
                { label: "June", y: 1259 },
                { label: "July", y: 2534 },
                { label: "August", y: 1959 },
                { label: "September", y: 1058 },
                { label: "October", y: 1859 },
                { label: "November", y: 1751 },
                { label: "December", y: 1459 }
            ]
        }]
    };
    
    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );
}

export default MonthlySells;
