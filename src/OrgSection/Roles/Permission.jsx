import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { CustomCheckbox } from 'src/components/CustomComponents';

import { Table } from 'antd';

import { PermissionController, PermissionModifyController } from '../../Services/org/Org.Services';

const App = ({ dataValues }) => {
  const dispatch = useDispatch();
  const IsFormDisabled = false;
  const [roleNestedList, setRoleNestedList] = useState([]);
  const [updatedRows, setUpdatedRows] = useState([]);
  const [loader, setLoader] = useState(false);
  const [flag, setFlag] = useState(false);
  const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = useState([]);

  useEffect(() => {
    dispatch(
      PermissionController(dataValues?.RoleId, (res) => {
        if (res.status) {
          const mapToData = (modules) =>
            modules.map((module) => ({
              key: module.ModulesId,
              ModulesName: module.ModulesName,
              CanRead: module.CanRead,
              CanWrite: module.CanWrite,
              PermissionId: module.PermissionId,
              children:
                module.children.length > 0
                  ? module.children.map((child) => ({
                      key: child.ModulesId,
                      ModulesName: child.ModulesName,
                      CanRead: child.CanRead,
                      CanWrite: child.CanWrite,
                      PermissionId: child.PermissionId,
                      children: null,
                    }))
                  : null,
            }));

          const data = mapToData(res.data.nested);
          setRoleNestedList(data);

          // Dynamically setting defaultExpandedRowKeys based on data
          const expandedKeys = data.map((module) => module.key);
          setDefaultExpandedRowKeys(expandedKeys);
        }
      })
    );
  }, [dataValues?.RoleId, flag]);

  const columns = [
    {
      title: 'Modules Name',
      dataIndex: 'ModulesName',
      key: 'ModulesName',
    },
    {
      title: 'Read',
      dataIndex: 'CanRead',
      key: 'CanRead',
      width: '12%',
      render: (_, record) => (
        <CustomCheckbox
          disabled={IsFormDisabled}
          checked={record.CanRead === 1}
          onChange={(e) => handleCheckboxChange(record.key, 'CanRead', e.target.checked)}
        />
      ),
    },
    {
      title: 'Write',
      dataIndex: 'CanWrite',
      width: '12%',
      key: 'CanWrite',
      render: (_, record) => (
        <CustomCheckbox
          disabled={IsFormDisabled}
          checked={record.CanWrite === 1}
          onChange={(e) => handleCheckboxChange(record.key, 'CanWrite', e.target.checked)}
        />
      ),
    },
  ];

  function flattenData(data) {
    const result = [];

    function flattenNode(node) {
      // Push the current node's relevant fields into the result
      result.push({
        PermissionId: node.PermissionId,
        CanRead: node.CanRead,
        CanWrite: node.CanWrite,
      });

      // Recursively flatten the children if they exist
      if (node.children) {
        node.children.forEach(flattenNode);
      }
    }

    // Start flattening from the root nodes
    data.forEach(flattenNode);
    return result;
  }

  const handleSave = () => {
    setLoader(true);
    // const uniqueUpdatedRows = updatedRows.map(row => ({
    //     PermissionId: row.PermissionId,
    //     CanRead: row.CanRead,
    //     CanWrite: row.CanWrite
    // }));

    const flattened = flattenData(roleNestedList);

    dispatch(
      PermissionModifyController({ ModifyArray: flattened }, (res) => {
        if (res.status) {
          setFlag(!flag);
        }
        setUpdatedRows([]);
        setLoader(false);
      })
    );
  };

  const handleCheckboxChange = (key, field, checked) => {
    const updateList = (items) =>
      items.map((item) => {
        if (item.key === key) {
          let updatedItem = {};
          let updatedChildren = [];

          // If it's a parent row with children, apply updates to children
          if (item?.children && item?.children?.length > 0) {
            // Update children based on the field being changed
            if (field === 'CanWrite' && checked) {
              updatedChildren = item?.children?.map((child) => ({
                ...child,
                CanWrite: 1,
                CanRead: 1,
              }));
            } else if (field === 'CanWrite' && !checked) {
              updatedChildren = item?.children?.map((child) => ({ ...child, CanWrite: 0 }));
            } else if (field === 'CanRead' && checked) {
              updatedChildren = item?.children?.map((child) => ({ ...child, CanRead: 1 }));
            } else if (field === 'CanRead' && !checked) {
              updatedChildren = item?.children?.map((child) => ({
                ...child,
                CanRead: 0,
                CanWrite: 0,
              }));
            }

            // Determine the parent's CanRead and CanWrite based on children's status
            const childrenCanRead = updatedChildren.some((child) => child.CanRead === 1);
            const childrenCanWrite = updatedChildren.some((child) => child.CanWrite === 1);

            updatedItem = {
              ...item,
              CanRead: childrenCanRead ? 1 : 0,
              CanWrite: childrenCanWrite ? 1 : 0,
              // Set both CanRead and CanWrite to 1 if a child has CanWrite = 1
              ...(childrenCanWrite && { CanRead: 1 }),
              children: updatedChildren,
            };

            const updatedParent = {
              key: item.key,
              PermissionId: item.PermissionId,
              CanRead: updatedItem.CanRead,
              CanWrite: updatedItem.CanWrite,
            };
            const updatedChildRows = updatedChildren.map((child) => ({
              key: child.key,
              PermissionId: child.PermissionId,
              CanRead: child.CanRead,
              CanWrite: child.CanWrite,
            }));

            setUpdatedRows((prev) => {
              const withoutParent = prev.filter((row) => row.key !== key); // Remove old parent entry
              return [...withoutParent, updatedParent, ...updatedChildRows]; // Add updated parent and children
            });
          } else {
            // If it's a child row (no children), update only that row
            if (field === 'CanWrite' && checked) {
              updatedItem = { ...item, CanWrite: 1, CanRead: 1 };
            } else if (field === 'CanWrite' && !checked) {
              updatedItem = { ...item, CanWrite: 0 };
            } else if (field === 'CanRead' && checked) {
              updatedItem = { ...item, CanRead: 1 };
            } else if (field === 'CanRead' && !checked) {
              updatedItem = { ...item, CanRead: 0, CanWrite: 0 };
            }

            const updatedRow = {
              key: item.key,
              PermissionId: item.PermissionId,
              CanRead: updatedItem.CanRead,
              CanWrite: updatedItem.CanWrite,
            };

            setUpdatedRows((prev) => {
              const withoutRow = prev.filter((row) => row.key !== key); // Remove old entry if exists
              return [...withoutRow, updatedRow]; // Add updated row
            });
          }

          return updatedItem;
        }
        if (item.children) {
          // Recursively update children and calculate parent's CanRead and CanWrite
          const updatedChildren = updateList(item.children);
          const childrenCanRead = updatedChildren.some((child) => child.CanRead === 1);
          const childrenCanWrite = updatedChildren.some((child) => child.CanWrite === 1);

          return {
            ...item,
            CanRead: childrenCanRead ? 1 : 0,
            CanWrite: childrenCanWrite ? 1 : 0,
            // Set both CanRead and CanWrite to 1 if any child has CanWrite = 1
            ...(childrenCanWrite && { CanRead: 1 }),
            children: updatedChildren,
          };
        }
        return item;
      });
    const updatedList = updateList(roleNestedList);
    setRoleNestedList(updatedList); // Update the main role list
  };

  return (
    <>
      {defaultExpandedRowKeys?.length > 0 && (
        <>
          <Table
            columns={columns}
            rowSelection={null}
            dataSource={roleNestedList}
            pagination={false}
            expandable={{ defaultExpandedRowKeys }}
            size="middle"
          />
          {!IsFormDisabled && (
            <Box sx={{ justifyContent: 'end', m: 1.5, display: 'flex' }}>
              {!loader ? (
                <Button
                  disabled={!updatedRows?.length > 0}
                  variant="contained"
                  type="button"
                  onClick={handleSave}
                  color="success"
                >
                  Save
                </Button>
              ) : (
                <ButtonLoader />
              )}
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default App;
