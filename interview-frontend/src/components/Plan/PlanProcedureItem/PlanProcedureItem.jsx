import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import { addProcedureUserToPlan, deleteProcedureUserToPlan } from "../../../api/api";
import { useParams } from "react-router-dom";

const PlanProcedureItem = ({ procedure, users, preselectedUserId }) => {
    const [selectedUsers, setSelectedUsers] = useState(null);
    let { id } = useParams();
    const prevSelectedUsers = selectedUsers;
    useEffect(() => {
        if (preselectedUserId !== 0 && preselectedUserId !== "0" && preselectedUserId !== undefined && preselectedUserId !== null) {
            //debugger;
            function selectItemsByValue(array, valuesToSelect) {
                const selectedItems = [];
                const values = valuesToSelect.split(',');
                for (const value of values) {
                    const intValue = parseInt(value, 10);
                    const selectedItem = array.find(item => item.value === intValue);
                    if (selectedItem) {
                        selectedItems.push(selectedItem);
                    }
                }
                return selectedItems;
            }

            const valuesToSelect = preselectedUserId;
            const selectedItems = selectItemsByValue(users, valuesToSelect);
            setSelectedUsers(selectedItems);
        }
    }, [preselectedUserId, users]);

    const handleAssignUserToProcedure = async (e) => {
        //debugger;
        setSelectedUsers(e);

        if (prevSelectedUsers !== null && prevSelectedUsers !== undefined) {
            const removedUsers = prevSelectedUsers.filter(
                (prevUser) => !e.find((currentUser) => currentUser.value === prevUser.value)
            );
            if (removedUsers[0]?.value !== undefined) {
                await deleteProcedureUserToPlan(id, procedure.procedureId, removedUsers[0].value);
            }
            const addedUsers = e.filter(
                (currentUser) => !prevSelectedUsers.find((prevUser) => currentUser.value === prevUser.value)
            );
            await addProcedureUserToPlan(id, procedure.procedureId, addedUsers[0].value);
        }
        else {
            for (let i = 0; i < e.length; i++) {
                await addProcedureUserToPlan(id, procedure.procedureId, e[i].value);
            }
        }

    };

    return (
        <div className="py-2">
            <div>
                {procedure.procedureTitle}
            </div>

            <ReactSelect
                className="mt-2"
                placeholder="Select User to Assign"
                isMulti={true}
                options={users}
                value={selectedUsers}
                onChange={(e) => handleAssignUserToProcedure(e)}
            />
        </div>

    );
};

export default PlanProcedureItem;
