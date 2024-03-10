import { KanbanColumnSkeleton, ProjectCardSkeleton } from '@/components'
import { KanbanAddCardButton } from '@/components/tasks/kanban/add-card-button'
import { KanbanBoard, KanbanBoardContainer } from '@/components/tasks/kanban/board'
import { ProjectCardMemo } from '@/components/tasks/kanban/card'
import KanbanColumn from '@/components/tasks/kanban/columns'
import KanbanItem from '@/components/tasks/kanban/item'
import { UPDATE_TASK_STAGE_MUTATION } from '@/graphql/mutations'
import { TASKS_QUERY, TASK_STAGES_QUERY } from '@/graphql/queries'
import { TaskStagesQuery, TasksQuery } from '@/graphql/types'
import { DragEndEvent } from '@dnd-kit/core'
import { useList, useNavigation, useUpdate } from '@refinedev/core'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import React from 'react'

type Task = GetFieldsFromList<TasksQuery>;
type TaskStage = GetFieldsFromList<TaskStagesQuery> & { tasks: Task[] };

const List = ({children}: React.PropsWithChildren) => {
    const { replace } = useNavigation();

    const { data: stages, isLoading: isLoadingStages} = useList<TaskStage>({
        resource: 'taskStages',
        filters: [
            {
                field: 'title',
                operator: 'in',
                value: ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE']
            }
        ],
        sorters: [
            {
                field: 'createdAt',
                order: 'asc'
            }
        ],
        meta: {
            gqlQuery: TASK_STAGES_QUERY
        }
    })
    const { data: tasks, isLoading: isLoadingTasks } = useList<GetFieldsFromList<TasksQuery>>({
        resource: 'tasks',
        sorters: [
            {
                field: 'dueDate',
                order: 'asc'
            }
        ],
        queryOptions: {
            enabled: !!stages,
        },
        pagination: {
            mode: 'off'
        },
        meta: {
            gqlQuery: TASKS_QUERY
        }
    })
    const { mutate: updateTask} = useUpdate();

    const taskStages = React.useMemo(() => {
        if(!tasks?.data || !stages?.data){
            return{
                unnasignedStages: [],
                stages: []
            }
        }
        const unnasignedStages = tasks.data.filter((task) => task.stageId === null)
        const grouped: TaskStage[] = stages.data.map((stage) => ({
            ...stage,
            tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id)
        }))
        return {
            unnasignedStages,
            columns: grouped
        }

    }, [stages, tasks])
    const handleAddCard = (args: { stageId: string }) => {
        const path =
          args.stageId === "unassigned"
            ? "/tasks/new"
            : `/tasks/new?stageId=${args.stageId}`;
    
        replace(path);
      };
    const isLoading = isLoadingStages || isLoadingTasks
    if (isLoading) return <PageSkeleton />

    const handleOnDragEnd = (event: DragEndEvent) => {
        let stageId = event.over?.id as undefined | string | null;
        const taskId = event.active.id as string;
        const taskStageId = event.active.data.current?.stageId;
        if (taskStageId === stageId) return;
        if ( stageId === 'unnasigned'){
            stageId = null;
        }
        updateTask({
            resource: 'tasks',
            id: taskId,
            values: {
                stageId: stageId
            },
            successNotification: false,
            mutationMode: 'optimistic',
            meta: {
                gqlMutation: UPDATE_TASK_STAGE_MUTATION
            }
        })
    }
   return (
    <>
    <KanbanBoardContainer>
        <KanbanBoard OnDragEnd={handleOnDragEnd}>
            <KanbanColumn
            id='unnasigned'
            title={'unnasigned'}
            count={taskStages.unnasignedStages.length || 0}
            onAddClick={() => handleAddCard({stageId: 'unnasigned'})}
            >
                {taskStages.unnasignedStages.map((task) => (
                    <KanbanItem key={task.id} id={task.id} 
                    data={{...taskStages, stageId: 'unnasigned'}}
                    >
                        <ProjectCardMemo 
                        {...task}
                        dueDate={task.dueDate || undefined}
                          />
                    </KanbanItem>
                ))}
                {!taskStages.unnasignedStages.length && (
                    <KanbanAddCardButton
                    onClick={() => handleAddCard({stageId: 'unnasigned'})}
                     />
                )}
            </KanbanColumn>
            {taskStages.columns?.map((column) =>{
               return <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                count={column.tasks.length}
                onAddClick={() => handleAddCard({stageId: column.id})}
                >
                    {!isLoading && column.tasks.map((task) => (
                        <KanbanItem key={task.id} id={task.id} data={task}>
                            <ProjectCardMemo 
                            {...task}
                            dueDate={task.dueDate || undefined}
                            />
                        </KanbanItem>
            ))}
                    {!column.tasks.length && (
                        <KanbanAddCardButton
                        onClick={() => handleAddCard({stageId: 'unnasigned'})}
                         />
                    )}
                </KanbanColumn>
                    })}
        </KanbanBoard>
    </KanbanBoardContainer>
    {children}
    </>
  )
}

export default List
const PageSkeleton = () => {
    const columnCount= 6;
    const itemCount = 4;

    return (
        <KanbanBoardContainer>
            {Array.from({length: columnCount}).map((_, index) =>(
                <KanbanColumnSkeleton key={index}>
                    {Array.from({length: itemCount}).map((_, index) => (
                        <ProjectCardSkeleton key={index} />
                    ))}
                </KanbanColumnSkeleton>
            ))}
        </KanbanBoardContainer>
    )
}