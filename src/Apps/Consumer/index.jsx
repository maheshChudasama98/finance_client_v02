
import { useDispatch } from 'react-redux';
import React, { useRef, useState, } from 'react'

import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
// import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
// import AddIcon from '@mui/icons-material/Add';
import CardHeader from '@mui/material/CardHeader';

import { UpLoadAPI, FetchConsumerNumbersListService } from 'src/Services/JuniorEngineer-services';

import { DataNotFound } from 'src/components/DataNotFound';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';

import * as XLSX from 'xlsx';

export default function Index() {
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const [uploadFileLoader, setUploadFileLoader] = useState(false);

    const handlerInsetCSVAction = () => {
        fileInputRef.current.click();
    };

    // useEffect(() => {
    //     dispatch(FetchConsumerNumbersListService(async (res) => {
    //         setConsumerList(res?.consumerList);
    //     }))
    // }, [])

    const expectedHeaders = [
        'FEEDER_NAME',
        'VILLAGE_NAME',
        'CONSUMER_NO',
        'CONSUMER_NAME',
        'CONTRACT_LOAD'
    ];
    const handleFileUpload = async (event) => {
        setUploadFileLoader(true);
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonArray = XLSX.utils.sheet_to_json(worksheet);

            const headers = jsonArray[0];

            const isValid = expectedHeaders.every(header => header in headers);

            if (!isValid) {
                console.log('The uploaded file does not contain the required headers.');
                setUploadFileLoader(false);
                return;
            }

            dispatch(FetchConsumerNumbersListService(async (res) => {
                const ConsumerList = await res?.consumerList
                const FilterNewConmber = jsonArray.filter(item => !ConsumerList?.includes(item?.CONSUMER_NO));

                const filteredData = FilterNewConmber.map(row => ({
                    FEEDER_NAME: row.FEEDER_NAME,
                    VILLAGE_NAME: row.VILLAGE_NAME,
                    CONSUMER_NO: row.CONSUMER_NO,
                    CONSUMER_NAME: row.CONSUMER_NAME,
                    CONTRACT_LOAD: row.CONTRACT_LOAD
                }));

                async function processInChunks(array, chunkSize) {
                    for (let i = 0; i < array.length; i += chunkSize) {
                        const chunk = array.slice(i, i + chunkSize);

                        const Payload = {
                            consumer: chunk
                        };
                        await new Promise((resolve, reject) => {
                            dispatch(UpLoadAPI(Payload, response => {
                                resolve();
                            }));
                        });

                    }
                }
                processInChunks(filteredData, 500);
                setUploadFileLoader(false);
            }));

        };

        reader.readAsBinaryString(file);
    };

    return (

        <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
            <Card>
                <CardHeader
                    title="Consumer"
                    subheader=""
                    action={
                        !uploadFileLoader ?
                            <Button
                                onClick={handlerInsetCSVAction}
                                variant="contained"
                                color="success" >
                                Consumer upload
                            </Button> : <ButtonLoader />
                    }
                />

                <Box sx={{ marginTop: 1.5, overflow: 'auto', }}>

                    <DataNotFound />

                </Box>

            </Card>
            <input
                style={{ display: "none" }}
                ref={fileInputRef}
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                type='file' />

        </Box>

    )
}

Index.propTypes = {
};