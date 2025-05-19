import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "ATS MCP Server",
  version: "1.0.0",
});

const api_key = `sso-jwt `+ process.env.API_KEY;
console.log("what is your name")
server.tool(
    "account",
    "Get Account Information",
    {orion_guid: z.string()},
    async ({orion_guid}) => {
        try {
            const auth = process.env.username + ":" + process.env.password;
            const token = btoa(auth);

            const response = await fetch(`https://diablo.api.test-godaddy.com/accounts/${orion_guid}?include[]=migrations&include[]=migration_accounts`,{
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "authorization": `Basic ${token}`,
                }
            });
            const data = await response.text();
            return { content:[{type: "text", text: data} ]};
        }
        catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Account information for ${error.message}` },
                ],
            };
        }

    }
)

server.tool(
    "installed_apps",
    "Get Installed Apps",
    {orion_guid: z.string()},
    async ({orion_guid}) => {
        try {
            const auth = process.env.username + ":" + process.env.password;
            const token = btoa(auth);
            const response = await fetch(`https://diablo.api.test-godaddy.com/accounts/${orion_guid}/get_installed_apps`,{
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "authorization": `Basic ${token}`,
                }
            });
            const data = await response.text();
            return { content:[{type: "text", text: data} ]};
        }
        catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Account information for ${error.message}` },
                ],
            };
        }
    }
)

server.tool(
    "available_php_version",
    "Get available PHP versions",
    {id: z.string()},
    async ({id}) => {
        try {
            const auth = process.env.username + ":" + process.env.password;
            const token = btoa(auth);
            const response = await fetch(`https://diablo.api.test-godaddy.com/accounts/${id}/get_available_php_versions/`,{
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "authorization": `Basic ${token}`,
                }
            });
            const data = await response.text();
            return { content:[{type: "text", text: data} ]};
        }
        catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Account information for ${error.message}` },
                ],
            };
        }
    }
)

server.tool(
    "account_error",
    "Get Account error information",
    {orion_guid: z.string()},
    async ({orion_guid}) => {
        try {
            const auth = process.env.username + ":" + process.env.password;
            const token = btoa(auth);

            const response = await fetch(`https://diablo.api.test-godaddy.com/accounts/${orion_guid}?include[]=account_errors`,{
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "authorization": `Basic ${token}`,
                }
            });
            const data = await response.text();
            return { content:[{type: "text", text: data} ]};
        }
        catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Account information for ${error.message}` },
                ],
            };
        }

    }
)

server.tool(
    "Server",
    "Get Account Server information",
    {orion_guid: z.string()},
    async ({orion_guid}) => {
        const auth = process.env.username + ":" + process.env.password;
        const token = btoa(auth);

        try {
            const response = await fetch(`https://diablo.api.test-godaddy.com/accounts/${orion_guid}?include[]=server`,{
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "authorization": `Basic ${token}`,
                }
            });
            const data = await response.text();
            return { content:[{type: "text", text: data} ]};
        }
        catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Account information for ${error.message}` },
                ],
            };
        }

    }
)

 
const transport = new StdioServerTransport();
(async () => {
  await server.connect(transport);
})();
