import React from 'react'
import { useDispatch } from 'react-redux';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { DownloadService } from 'src/Services/General.Services';

import SvgColor from 'src/components/svg-color';

import { Dropdown } from 'antd';

import * as XLSX from 'xlsx';

import FileSaver from "file-saver";



const Download = () => {
    const dispatch = useDispatch()
    const handleDownload = (days) => {

        dispatch(DownloadService(days, (res) => {

            const NewData = res?.map((obj) =>
            ({
                "SR NO": obj?.Complaint_Id,
                "Nos of Consumer connected on Transformer": obj?.Number_Of_Connection,
                "Dt of failure (DD/MM/YYYY)": fDate(obj?.createdAt),
                "Sub Division": "KUVADAVA",
                "Village": obj?.Village?.Village_EnName,
                "Name of Location": obj?.Consumer_FullName,
                "Name of Feeder": obj?.Feeder?.Feeder_Name,
                "Category of feeders": obj?.Feeder?.Feeder_Type,
                "KVA Capacity": obj?.Transformer_Capacity,
                "Make": obj?.Transformer_Make,
                "SGP Serial No.": obj?.Serial_Number,
                "RGP/ OGP Job No.": obj?.Job_Number,
                "DT OF DISPATCH / JOB DATE": obj?.DispatchNumber_Date,
                "Oil Capacity as per name plate in Ltr.": obj?.Oil_Level,
                "Oil Shortage Measured in Ltr.": obj?.Oli_Sortage,
                "MD": obj?.MeterMd,
                "LOAD": obj?.Contracted_Load,
                "Consumer Number": obj?.Consumer_Number,
                "REASON": obj?.Reason,
                "Substation Name": obj?.Feeder?.Substation_Name,
            })
            )

            const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            // const fileExtension = ".xlsx";
            const ws = XLSX.utils.json_to_sheet(NewData);
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, "Applications.xlsx");

        }))
    };

    return (
        <Dropdown
            menu={{
                items: [{
                    label: (
                        <Typography variant="body1" fontSize={16} onClick={() => handleDownload(15)} > last 15 Days</Typography>
                    ),
                },
                {
                    label: (
                        <Typography variant="body1" fontSize={16} onClick={() => { handleDownload(30) }}> last 30 Days </Typography>
                    ),
                },
                {
                    label: (
                        <Typography variant="body1" fontSize={16} onClick={() => { handleDownload(90) }}> last 90 Days </Typography>
                    ),
                }
                ],
            }}
            placement="bottom"
            arrow={{
                pointAtCenter: true,
            }}>
            <Button variant="contained" color="success"  >
                <SvgColor src="/assets/icons/general/download.svg" sx={{ width: 23, height: 23, }} />
            </Button>
        </Dropdown >

    );
}

export default Download