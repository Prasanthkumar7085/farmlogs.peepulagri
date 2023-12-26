const deleteAssigneeInTaskService=async({id,token,body}:{id:string,token:string,body:any})=>{
 
    try {
        let options = {
            method: "DELETE",
            headers: new Headers({
              "content-type": "application/json",
              authorization: token,
            }),
            body: JSON.stringify(body),
          };
        
          let response: any = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}/assignee`,
            options
          );
        let responseData = await response.json();
        return responseData;
        
    } catch (err) {
        console.error(err);
        throw err
        
    }
}

export default deleteAssigneeInTaskService;