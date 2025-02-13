import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { ContractorID, } from 'src/constance';
import { FetchUserListController } from 'src/Services/User.Services';

import { ModalDialog } from 'src/components/model/index';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomSearchInput } from 'src/components/CustomComponents';

import BranchForm from './BranchForm';
import BranchList from './BranchList';

const list = [{
    "TransactionId": 4,
    "Action": "In",
    "Date": "2025-01-04",
    "Amount": "100.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": null,
    "ParentTransactionId": null,
    "PartyId": null,
    "AccountAmount": "100.00",
    "PartyAmount": null,
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T04:25:13.000Z",
    "updatedAt": "2025-01-24T04:25:13.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": null,
    "PartyDetails": null
},
{
    "TransactionId": 8,
    "Action": "Out",
    "Date": "2025-01-04",
    "Amount": "50.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": null,
    "ParentTransactionId": null,
    "PartyId": null,
    "AccountAmount": "-50.00",
    "PartyAmount": null,
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T04:25:44.000Z",
    "updatedAt": "2025-01-24T04:25:44.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": null,
    "PartyDetails": null
},
{
    "TransactionId": 9,
    "Action": "Out",
    "Date": "2025-01-04",
    "Amount": "50.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": null,
    "ParentTransactionId": null,
    "PartyId": null,
    "AccountAmount": "-50.00",
    "PartyAmount": null,
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T04:39:51.000Z",
    "updatedAt": "2025-01-24T04:39:51.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": null,
    "PartyDetails": null
},
{
    "TransactionId": 12,
    "Action": "Out",
    "Date": "2025-01-04",
    "Amount": "50.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": null,
    "ParentTransactionId": null,
    "PartyId": null,
    "AccountAmount": "-50.00",
    "PartyAmount": null,
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T04:42:37.000Z",
    "updatedAt": "2025-01-24T04:42:37.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": null,
    "PartyDetails": null
},
{
    "TransactionId": 13,
    "Action": "Out",
    "Date": "2025-01-04",
    "Amount": "50.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": null,
    "ParentTransactionId": null,
    "PartyId": null,
    "AccountAmount": "-50.00",
    "PartyAmount": null,
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T04:45:29.000Z",
    "updatedAt": "2025-01-24T04:45:29.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": null,
    "PartyDetails": null
},
{
    "TransactionId": 14,
    "Action": "From",
    "Date": "2025-01-04",
    "Amount": "50.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": 2,
    "ParentTransactionId": null,
    "PartyId": null,
    "AccountAmount": "-50.00",
    "PartyAmount": null,
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T06:51:15.000Z",
    "updatedAt": "2025-01-24T06:51:15.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 2,
        "AccountName": "BOI"
    },
    "PartyDetails": null
},
{
    "TransactionId": 16,
    "Action": "From",
    "Date": "2025-01-04",
    "Amount": "50.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": 2,
    "ParentTransactionId": null,
    "PartyId": null,
    "AccountAmount": "-50.00",
    "PartyAmount": null,
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T08:32:37.000Z",
    "updatedAt": "2025-01-24T08:32:37.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 2,
        "AccountName": "BOI"
    },
    "PartyDetails": null
},
{
    "TransactionId": 18,
    "Action": "Investment",
    "Date": "2025-01-04",
    "Amount": "50.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": 2,
    "ParentTransactionId": null,
    "PartyId": null,
    "AccountAmount": "-50.00",
    "PartyAmount": null,
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T10:25:17.000Z",
    "updatedAt": "2025-01-24T10:25:17.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 2,
        "AccountName": "BOI"
    },
    "PartyDetails": null
},
{
    "TransactionId": 20,
    "Action": "Credit",
    "Date": "2025-01-04",
    "Amount": "50.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": null,
    "ParentTransactionId": null,
    "PartyId": 1,
    "AccountAmount": "50.00",
    "PartyAmount": "-50.00",
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T10:25:27.000Z",
    "updatedAt": "2025-01-24T10:25:27.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": null,
    "PartyDetails": {
        "PartyId": 1,
        "FullName": "PA1 Test",
        "PartyAvatar": "PT",
        "PartyLastName": "Test",
        "PartyFirstName": "PA1"
    }
},
{
    "TransactionId": 21,
    "Action": "Debit",
    "Date": "2025-01-04",
    "Amount": "50.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": null,
    "ParentTransactionId": null,
    "PartyId": 1,
    "AccountAmount": "-50.00",
    "PartyAmount": "50.00",
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T10:25:34.000Z",
    "updatedAt": "2025-01-24T10:25:34.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": null,
    "PartyDetails": {
        "PartyId": 1,
        "FullName": "PA1 Test",
        "PartyAvatar": "PT",
        "PartyLastName": "Test",
        "PartyFirstName": "PA1"
    }
},
{
    "TransactionId": 3,
    "Action": "In",
    "Date": "2025-01-03",
    "Amount": "100.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": null,
    "ParentTransactionId": null,
    "PartyId": null,
    "AccountAmount": "100.00",
    "PartyAmount": null,
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T04:25:11.000Z",
    "updatedAt": "2025-01-24T04:25:11.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": null,
    "PartyDetails": null
},
{
    "TransactionId": 7,
    "Action": "Out",
    "Date": "2025-01-03",
    "Amount": "50.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": null,
    "ParentTransactionId": null,
    "PartyId": null,
    "AccountAmount": "-50.00",
    "PartyAmount": null,
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T04:25:42.000Z",
    "updatedAt": "2025-01-24T04:25:42.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": null,
    "PartyDetails": null
},
{
    "TransactionId": 2,
    "Action": "In",
    "Date": "2025-01-02",
    "Amount": "100.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": null,
    "ParentTransactionId": null,
    "PartyId": null,
    "AccountAmount": "100.00",
    "PartyAmount": null,
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T04:25:08.000Z",
    "updatedAt": "2025-01-24T04:25:08.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": null,
    "PartyDetails": null
},
{
    "TransactionId": 6,
    "Action": "Out",
    "Date": "2025-01-02",
    "Amount": "50.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": null,
    "ParentTransactionId": null,
    "PartyId": null,
    "AccountAmount": "-50.00",
    "PartyAmount": null,
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T04:25:40.000Z",
    "updatedAt": "2025-01-24T04:25:40.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": null,
    "PartyDetails": null
},
{
    "TransactionId": 1,
    "Action": "In",
    "Date": "2025-01-01",
    "Amount": "100.00",
    "CategoryId": 2,
    "SubCategoryId": 2,
    "AccountId": 1,
    "TransferToAccountId": null,
    "ParentTransactionId": null,
    "PartyId": null,
    "AccountAmount": "100.00",
    "PartyAmount": null,
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T04:25:02.000Z",
    "updatedAt": "2025-01-24T04:25:02.000Z",
    "CategoryName": "CA2",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "SCA2",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 2,
        "CategoryName": "CA2"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 2,
        "SubCategoriesName": "SCA2"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": null,
    "PartyDetails": null
},
{
    "TransactionId": 5,
    "Action": "Out",
    "Date": "2025-01-01",
    "Amount": "50.00",
    "CategoryId": 1,
    "SubCategoryId": 1,
    "AccountId": 1,
    "TransferToAccountId": null,
    "ParentTransactionId": null,
    "PartyId": null,
    "AccountAmount": "-50.00",
    "PartyAmount": null,
    "Description": null,
    "Tags": null,
    "isDeleted": 0,
    "UsedBy": 1,
    "OrgId": 1,
    "BranchId": 1,
    "createdAt": "2025-01-24T04:25:36.000Z",
    "updatedAt": "2025-01-24T04:25:36.000Z",
    "CategoryName": "CA1",
    "CategoryIcon": "#0000",
    "CategoryColor": "#0000",
    "SubCategoriesName": "Abcdefghijkml",
    "CategoryDetails": {
        "Icon": "#0000",
        "Color": "#1b925e",
        "CategoryId": 1,
        "CategoryName": "CA1"
    },
    "SubCategoryDetails": {
        "Icon": "#0000",
        "SubCategoryId": 1,
        "SubCategoriesName": "Abcdefghijkml"
    },
    "AccountDetails": {
        "Icon": "cash",
        "Color": "#1b925e",
        "ImgPath": null,
        "AccountId": 1,
        "AccountName": "Cash"
    },
    "TransferDetails": null,
    "PartyDetails": null
}
]

export default function Index() {
    const dispatch = useDispatch();
    const ReduxUserRole = useSelector(state => state.auth.userRole);
    const [displayFlag, setDisplayFlag] = useState(false);
    // const [userList, setUserList] = useState([]);
    const [editObject, setEditObject] = useState({});
    const [open, setOpen] = useState(false);

    const showDisplayAction = () => {
        setDisplayFlag(!displayFlag);
        setEditObject({});
    }

    const FetchUserList = () => {
        dispatch(FetchUserListController((res) => {
            // setUserList(res);
        }))
    };

    useEffect(() => {
        if (!displayFlag) {
            FetchUserList();
        }
    }, [displayFlag])

    const DeleteAction = () => {
    }

    // const StatusCheck = (status) => {
    //     switch (status) {
    //         case StaffID:
    //             return <Chip sx={{
    //                 color: "#fff",
    //                 backgroundColor: (theme) => `${theme?.palette?.Staff}`
    //             }} label="Staff" />;
    //         case ContractorID:
    //             return <Chip
    //                 sx={{
    //                     color: "#fff",
    //                     backgroundColor: (theme) => `${theme?.palette?.Contractor}`
    //                 }} label="Contractor" />;
    //         case JuniorEngineerID:
    //             return <Chip
    //                 sx={{
    //                     color: "#fff",
    //                     backgroundColor: (theme) => `${theme?.palette?.JuniorEngineer}`
    //                 }} label="Junior Engineer" />
    //         case SuperAdminID:
    //             return <Chip
    //                 sx={{
    //                     color: "#fff",
    //                     backgroundColor: (theme) => `${theme?.palette?.SuperAdmin}`
    //                 }} label="SuperAdmin" />
    //         default:
    //             break
    //     }
    // };


    // const tableSetData = userList.map((item, index) => ({
    //     index: <Typography variant="normal"> {index + 1}</Typography>,
    //     User_Avatar: <Stack direction="row" alignItems="center" spacing={2} >
    //         <CustomAvatar displayName={item?.User_Avatar} />
    //         <Typography variant="normal">
    //             {fText(`${item?.User_FirstName} ${item?.User_LastName}`)}
    //             <Typography variant="light" color="text.secondary">
    //                 {fText(`${item?.User_Email}`)}
    //             </Typography>
    //         </Typography>
    //     </Stack>,
    //     User_EmploymentNumber:
    //         <Typography variant="normal" >
    //             # {item?.User_EmploymentNumber}
    //         </Typography>,
    //     UserType_Id: StatusCheck(item?.UserType_Id),
    //     createdAt: <Typography variant="normal" > {fDate(item?.createdAt)}</Typography>,
    //     action: <Typography variant="normal" >-</Typography>,
    //     child: <Stack direction="row" alignItems="center" spacing={2} >
    //         <CustomAvatar displayName={item?.User_Avatar} />
    //         <Typography variant="normal">
    //             {fText(`${item?.User_FirstName} ${item?.User_LastName}`)}
    //             <Typography variant="light" color="text.secondary">
    //                 {fText(`${item?.User_Email}`)}
    //             </Typography>
    //         </Typography>
    //     </Stack>,
    // }));

    const groupedByDate = list.reduce((acc, item) => {
        let dateGroup = acc.find(group => group.date === item.Date);

        if (!dateGroup) {
            dateGroup = { date: item.Date, totalIn: 0, totalOut: 0, dayTotal: 0, records: [] };
            acc.push(dateGroup);
        };

        const amount = parseFloat(item.Amount);
        if (item.Action === "In") {
            dateGroup.totalIn += amount;
        } else if (item.Action === "Out") {
            dateGroup.totalOut += amount;
        };

        dateGroup.dayTotal = dateGroup.totalIn - dateGroup.totalOut;
        dateGroup.records.push(item);
        return acc;
    }, []);




    return (

        <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
            <Card>

                <CardHeader
                    title="Branches"
                    action={
                        ReduxUserRole !== ContractorID &&
                        <Button
                            onClick={showDisplayAction}
                            variant="contained"
                            color="success"
                            startIcon={!displayFlag ? <AddIcon /> : <ArrowBackIcon />} >
                            {!displayFlag ? "Add New" : "Back"}
                        </Button>
                    }
                />

                <Box sx={{
                    borderRadius: 1.3,
                    paddingY: 2,
                    // paddingX: { xs: 0, sm: 2 },
                }}>

                    {
                        displayFlag ?
                            <BranchForm backAction={showDisplayAction} editObject={editObject} /> :
                            <Box sx={{
                                marginTop: 1.5,
                                // overflowY: 'hidden',
                                // overflowX: 'auto',
                            }}>
                                <Box sx={{ my: 2, paddingX: { xs: 0, sm: 2 } }}>
                                    <CustomSearchInput size="small" />
                                </Box>

                                {
                                    groupedByDate && groupedByDate?.length > 0 ?
                                        <Box sx={{}}>
                                            {
                                                groupedByDate.map((item, index) => (<BranchList item={item} index={index} key={index} />)
                                                )
                                            }
                                            {/* <BranchList /> */}
                                        </Box>
                                        : <DataNotFound />
                                }
                            </Box>
                    }
                </Box>


            </Card >

            <ModalDialog
                title="Delete"
                open={open}
                handleClose={() => { setOpen(false); }}>
                <Box sx={{ minWidth: 500, }}>

                    <Typography variant='h5' fontWeight={100} >Are you sure want to delete?</Typography>

                    <Box sx={{ mt: 2, textAlign: "end" }}>
                        <Button onClick={DeleteAction} variant="contained" color="error">
                            Delete
                        </Button>
                        <Button sx={{ marginX: 1 }} onClick={() => { setOpen(false); }} variant="outlined" color="CancelButton">
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </ModalDialog >
        </Box >

    )
}

Index.propTypes = {
};