import React from 'react'

import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FilterListIcon from '@mui/icons-material/FilterList';

import { Dropdown } from 'antd';

const Filters = ({ value, FilterAction }) => (
    <Dropdown
        menu={{
            items: [{
                label: (
                    <Typography variant="body1" fontSize={16} onClick={() => FilterAction("AG")} >AG</Typography>
                ),
                key: 'AG',
            },
            {
                label: (
                    <Typography variant="body1" fontSize={16} onClick={() => { FilterAction("JGY") }}>JGY</Typography>
                ),
                key: 'JGY',
            },
            {
                label: (
                    <Typography variant="body1" fontSize={16} onClick={() => { FilterAction("All") }}>All</Typography>
                ),
                key: 'All',
            }
            ],
            selectable: true,
            defaultSelectedKeys: [value],
        }}
        placement="bottom"
        arrow={{
            pointAtCenter: true,
        }}>
        <Badge color="error"
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            badgeContent={value === "All" ? 0 : 1}>
            <Button color="success" variant="outlined" sx={{ mr: 1 }} >
                <FilterListIcon />
            </Button>
        </Badge>
    </Dropdown >
);

export default Filters