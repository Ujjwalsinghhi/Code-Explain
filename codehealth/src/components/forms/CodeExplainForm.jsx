import React from 'react'
import { useActionState } from "react";
import { explain } from '../../actions';
import CodeExplanation from '../CodeExplanation';
import Error from '../Error';

const CodeExplainForm = () => {
    const [formState, formAction, isPending] = useActionState(explain, null);
  return (
    <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-lg mt-8">
        <form action={formAction}> 
            <label className="block text-lg font-medium mb-2">Language</label>
            <select
                name = "language"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option> 

            </select>
            <label className="block text-lg font-medium mb-2">Your Code</label>
            <textarea
                name="code"
                required
                placeholder="Paste your code here...."
                className="border rounded-lg w-full p-3 font-mono text-sm h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent min-h-[150px]"
                />
            <button 
                   type="submit"
                   disabled={isPending}
                   className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 hover:bg-blue-700 transition-shadow duration-300 shadow-md hover:shadow-lg"
                   >
                {isPending ? "Explaining..." : "Explain Code"}
            </button>

            
        </form>
        {isPending ? (
        <p className="bg-gray-300 my-3 w-64 p-2 rounded-sm">Thinking...</p>
      ) : formState?.success ? (
       <CodeExplanation explanation={formState?.data.explanation} />
      ) : (
        formState?.success === false && (
         <Error error={formState?.error} />
        )
      )}
    </div>
  );
};

export default CodeExplainForm
