import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  addProcedureToPlan,
  getPlanProcedures,
  getProcedures,
  getUsers,
  getPlanUserProcedures,
} from "../../api/api";
import Layout from '../Layout/Layout';
import ProcedureItem from "./ProcedureItem/ProcedureItem";
import PlanProcedureItem from "./PlanProcedureItem/PlanProcedureItem";

const Plan = () => {
  let { id } = useParams();
  const [procedures, setProcedures] = useState([]);
  const [originalProcedures, setOriginalProcedures] = useState([]);
  const [planProcedures, setPlanProcedures] = useState([]);
  const [users, setUsers] = useState([]);
  const [typedProcedureName, setTypedProcedureName] = useState([]);
  const handleTextboxChange =  (e) => {
    //debugger;
    //setSelectedUsers(e);    
    //setProcedureName((prevTypedProcedureName) => e.target.value);
    setTypedProcedureName(e.target.value);
    if(typedProcedureName != ''){
      const typedProcedureNameLowerCase = typedProcedureName.toLowerCase();
      const filteredArray = originalProcedures.filter(item =>
        item.procedureTitle.toLowerCase().includes(typedProcedureNameLowerCase)
      );
      setProcedures(filteredArray);
    }
    else{
      setProcedures(originalProcedures);
    }
    
  };
  useEffect(() => {
    (async () => {
      var procedures = await getProcedures();
      var planProcedures = await getPlanProcedures(id);
      var userPlanProcedures = await getPlanUserProcedures(id);
      // debugger;
      const mergedResponse = [...planProcedures, ...userPlanProcedures];

      function removeDuplicatesAndConcatenateTitles(arr, idProperty, titleProperty) {
        const result = [];
        const seen = new Set();

        arr.forEach((item) => {
          const id = item[idProperty];
          if (!seen.has(id)) {
            seen.add(id);
            result.push(item);
          } else {
            const existingItem = result.find((i) => i[idProperty] === id);
            existingItem[titleProperty] += `, ${item[titleProperty]}`;
          }
        });

        return result;
      }

      var finalResponse = removeDuplicatesAndConcatenateTitles(mergedResponse, "procedureId", "userId");
      var users = await getUsers();

      var userOptions = [];
      users.map((u) => userOptions.push({ label: u.name, value: u.userId }));

      setUsers(userOptions);
      setProcedures(procedures);
      setOriginalProcedures(procedures);
      setPlanProcedures(finalResponse);
    })();
  }, [id]);

  const handleAddProcedureToPlan = async (procedure) => {
    const hasProcedureInPlan = planProcedures.some((p) => p.procedureId === procedure.procedureId);
    if (hasProcedureInPlan) return;

    await addProcedureToPlan(id, procedure.procedureId);
    setPlanProcedures((prevState) => {
      return [
        ...prevState,
        {
          planId: id,
          procedureId: procedure.procedureId,
          procedure: {
            procedureId: procedure.procedureId,
            procedureTitle: procedure.procedureTitle,
          },
        },
      ];
    });
  };

  return (
    <Layout>
      <div className="container pt-4">
        <div className="d-flex justify-content-center">
          <h2>OEC Interview Frontend</h2>
        </div>
        <div className="row mt-4">
          <div className="col">
            <div className="card shadow">
              <h5 className="card-header">Repair Plan</h5>
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <h4>Procedures</h4>
                    <input
            type="text"
            value={typedProcedureName}
            onChange={handleTextboxChange}
         />
                    <div>
                      {procedures.map((p) => (
                        <ProcedureItem
                          key={p.procedureId}
                          procedure={p}
                          handleAddProcedureToPlan={handleAddProcedureToPlan}
                          planProcedures={planProcedures}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="col">
                    <h4>Added to Plan</h4>
                    <div>
                      {planProcedures.map((p) => (
                        <PlanProcedureItem
                          key={p.procedure.procedureId}
                          procedure={p.procedure}
                          users={users}
                          preselectedUserId={p.userId !== null && p.userId !== undefined ? p.userId : 0}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Plan;
