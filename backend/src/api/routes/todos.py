from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from src.core.db import get_session
from src.models.task import Task
from src.dependencies.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/todos", tags=["todos"])

@router.post("/", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_todo(
    task: Task,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    task.user_id = current_user
    task.created_at = datetime.utcnow()
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.get("/", response_model=List[Task])
def list_todos(
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    statement = select(Task).where(Task.user_id == current_user)
    results = session.exec(statement).all()
    return results

@router.get("/{id}", response_model=Task)
def get_todo(
    id: int,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    task = session.get(Task, id)
    if not task or task.user_id != current_user:
        raise HTTPException(status_code=404, detail="Todo not found")
    return task

@router.put("/{id}", response_model=Task)
def update_todo(
    id: int,
    task_update: Task,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    print(f"[API] PUT /api/todos/{id} - User: {current_user}")
    print(f"[API] Update data: {task_update.dict(exclude_unset=True)}")

    db_task = session.get(Task, id)
    if not db_task or db_task.user_id != current_user:
        print(f"[API] Todo {id} not found or access denied")
        raise HTTPException(status_code=404, detail="Todo not found")

    task_data = task_update.dict(exclude_unset=True)
    for key, value in task_data.items():
        if key not in ["id", "user_id", "created_at"]:
            setattr(db_task, key, value)

    db_task.updated_at = datetime.utcnow()
    print(f"[API] Saving update to DB for todo {id}")
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    print(f"[API] Successfully updated todo {id}")
    return db_task

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    id: int,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    print(f"[API] DELETE /api/todos/{id} - User: {current_user}")
    task = session.get(Task, id)
    if not task or task.user_id != current_user:
        print(f"[API] Todo {id} not found or access denied")
        raise HTTPException(status_code=404, detail="Todo not found")

    print(f"[API] Deleting todo {id} from DB")
    session.delete(task)
    session.commit()
    print(f"[API] Successfully deleted todo {id}")
    return None

@router.patch("/{id}/complete", response_model=Task)
def toggle_todo_complete(
    id: int,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    print(f"[API] PATCH /api/todos/{id}/complete - User: {current_user}")
    task = session.get(Task, id)
    if not task or task.user_id != current_user:
        print(f"[API] Todo {id} not found or access denied")
        raise HTTPException(status_code=404, detail="Todo not found")

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    print(f"[API] Toggling completion for todo {id} to {task.completed}")
    session.add(task)
    session.commit()
    session.refresh(task)
    print(f"[API] Successfully toggled todo {id}")
    return task
