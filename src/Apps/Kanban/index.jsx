import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from "@mui/material/Typography";
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Empty } from 'antd';
import Sortable from 'sortablejs';

// Sample initial data
const initialData = [
    {
        "TopicId": 1,
        "TopicTitle": "YEAR",
        "TopicDesc": null,
        "ColorCode": null,
        "Position": 1,
        "tasks": [
            {
                "TaskId": 1,
                "TopicId": 1,
                "Position": 1,
                "TaskDesc": null,
                "ImagePart": null,
                "TaskTitle": "Task 1"
            },
            {
                "TaskId": 2,
                "TopicId": 1,
                "Position": 2,
                "TaskDesc": null,
                "ImagePart": null,
                "TaskTitle": "Task 2"
            },
            {
                "TaskId": 3,
                "TopicId": 1,
                "Position": 3,
                "TaskDesc": null,
                "ImagePart": null,
                "TaskTitle": "Task 3"
            }
        ]
    },
    {
        "TopicId": 2,
        "TopicTitle": "YEAR-0",
        "TopicDesc": null,
        "ColorCode": null,
        "Position": 2,
        "tasks": [
            {
                "TaskId": 4,
                "TopicId": 2,
                "Position": 4,
                "TaskDesc": null,
                "ImagePart": null,
                "TaskTitle": "Task 3"
            },
            {
                "TaskId": 5,
                "TopicId": 2,
                "Position": 5,
                "TaskDesc": null,
                "ImagePart": null,
                "TaskTitle": "Task 5"
            },
            {
                "TaskId": 6,
                "TopicId": 2,
                "Position": 6,
                "TaskDesc": null,
                "ImagePart": null,
                "TaskTitle": "Task 4"
            }
        ]
    },
    {
        "TopicId": 3,
        "TopicTitle": "YEAR-0",
        "TopicDesc": null,
        "ColorCode": null,
        "Position": 3,
        "tasks": []
    }
]

export default function Index() {
    const [columns, setColumns] = useState(initialData);
    const mainContainerRef = useRef(null);
    const subContainerRefs = useRef({});

    // SortableJS for the main Kanban board
    useEffect(() => {
        if (!mainContainerRef.current) return;

        Sortable.create(mainContainerRef.current, {
            animation: 150,
            group: "columns",
            handle: ".drag-handle",
            onEnd: (evt) => {
                const { oldIndex, newIndex } = evt;



                if (oldIndex !== newIndex) {
                    setColumns((prev) => {
                        const updatedColumns = [...prev];
                        const movedItem = updatedColumns.splice(oldIndex, 1)[0];
                        updatedColumns.splice(newIndex, 0, movedItem);

                        console.log("Topic Moved:", {
                            TopicId: movedItem.TopicId,
                            newPosition: newIndex + 1
                        });

                        return updatedColumns;
                    });
                }
            },
        });

    }, []);

    useEffect(() => {
        Object.keys(subContainerRefs.current).forEach((columnId) => {
            if (!subContainerRefs.current[columnId]) return;

            Sortable.create(subContainerRefs.current[columnId], {
                animation: 150,
                group: "sub-cards",
                handle: ".sub-drag-handle",
                onEnd: (evt) => {
                    const { from, to, oldIndex, newIndex } = evt;
                    console.log(from.dataset, to.dataset, oldIndex, newIndex, "evtevtevtevtevtevtevtevtevtevt");

                    const fromColumnId = parseInt(from.dataset.id);
                    const toColumnId = parseInt(to.dataset.id);

                    if (fromColumnId !== toColumnId || oldIndex !== newIndex) {
                        setColumns((prev) => {
                            const updatedColumns = [...prev];
                            const fromColumn = updatedColumns.find(col => col.id === fromColumnId);
                            const toColumn = updatedColumns.find(col => col.id === toColumnId);

                            if (fromColumn && toColumn) {
                                const movedItem = fromColumn.items.splice(oldIndex, 1)[0];
                                toColumn.items.splice(newIndex, 0, movedItem);
                            }
                            return updatedColumns;
                        });
                    }
                },
            });
        });
    }, [columns]); // Re-run when columns update


    // useEffect(() => {
    //     if (!mainContainerRef.current) return;

    //     Sortable.create(mainContainerRef.current, {
    //         animation: 150,
    //         group: "columns",
    //         handle: ".drag-handle",
    //         onEnd: (evt) => {
    //             const { oldIndex, newIndex } = evt;
    //             if (oldIndex !== newIndex) {
    //                 setColumns((prev) => {
    //                     const updatedColumns = [...prev];
    //                     const movedItem = updatedColumns.splice(oldIndex, 1)[0];
    //                     updatedColumns.splice(newIndex, 0, movedItem);

    //                     console.log("Topic Moved:", {
    //                         TopicId: movedItem.TopicId,
    //                         newPosition: newIndex + 1 // Positions start from 1
    //                     });

    //                     return updatedColumns;
    //                 });
    //             }
    //         },
    //     });
    // }, []);


    // useEffect(() => {
    //     Object.keys(subContainerRefs.current).forEach((columnId) => {
    //         if (!subContainerRefs.current[columnId]) return;

    //         Sortable.create(subContainerRefs.current[columnId], {
    //             animation: 150,
    //             group: "sub-cards",
    //             handle: ".sub-drag-handle",
    //             onEnd: (evt) => {
    //                 const { from, to, oldIndex, newIndex } = evt;

    //                 const fromColumnId = parseInt(from.dataset.id);
    //                 const toColumnId = parseInt(to.dataset.id);

    //                 if (fromColumnId !== toColumnId || oldIndex !== newIndex) {
    //                     setColumns((prev) => {
    //                         const updatedColumns = [...prev];
    //                         const fromColumn = updatedColumns.find(col => col.TopicId === fromColumnId);
    //                         const toColumn = updatedColumns.find(col => col.TopicId === toColumnId);

    //                         if (fromColumn && toColumn) {
    //                             const movedItem = fromColumn.tasks.splice(oldIndex, 1)[0];
    //                             toColumn.tasks.splice(newIndex, 0, movedItem);

    //                             console.log("Task Moved:", {
    //                                 TaskId: movedItem.TaskId,
    //                                 oldTopicId: fromColumnId,
    //                                 newTopicId: toColumnId,
    //                                 newPosition: newIndex + 1 // Positions start from 1
    //                             });
    //                         }
    //                         return updatedColumns;
    //                     });
    //                 }
    //             },
    //         });
    //     });
    // }, [columns]);


    return (
        <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
            <Box sx={{ marginTop: 1.5 }}>
                <Box sx={{ justifyContent: "space-between", display: "flex" }}>
                    <Typography variant="h4" sx={{ m: 2 }} color="text.secondary">
                        Hi, Kanban
                    </Typography>
                </Box>

                {/* Main Kanban Board */}
                <Grid container spacing={2} ref={mainContainerRef}>
                    {columns.map((column, key) => (
                        <Grid item xs={12} md={3} key={key} data-id={column?.TopicId}>
                            <InfoBox
                                column={column}
                                ref={(el) => (subContainerRefs?.current[column?.TopicId] = el) || 0}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

const InfoBox = React.forwardRef(({ column }, ref) => {
    console.log("");

    return (
        <Card sx={{ backgroundColor: "background.lightgrey" }}>
            <CardHeader
                title={<Typography variant="bold">{column?.TopicTitle || ""}</Typography>}
                action={
                    <IconButton className="drag-handle">
                        <DragIndicatorIcon />
                    </IconButton>
                }
            />
            <Box sx={{ p: 2 }} ref={ref} data-id={column?.TopicId}>
                {column?.tasks?.length > 0 ? (
                    column?.tasks?.map((item, index) => (
                        <Card key={index} sx={{ my: 1 }}>
                            <CardHeader
                                title={<Typography variant="normal">Item {item?.TaskTitle || ""}</Typography>}
                                action={
                                    <IconButton className="sub-drag-handle">
                                        <DragIndicatorIcon />
                                    </IconButton>
                                }
                            />
                            <Box sx={{ px: 3, pb: 2 }}>
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            </Box>
                        </Card>
                    ))
                ) : (
                    <Box sx={{ px: 3, pb: 2 }}>
                        <Empty description="No items" />
                    </Box>
                )}
            </Box>
        </Card>
    );
});
