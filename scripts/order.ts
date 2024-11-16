interface EthEvent {
    address: string;
    blockNumber: string;
    data: string;
    gasPrice: string;
    gasUsed: string;
    logIndex: string;
    timeStamp: string;
    topics: (string | null)[];
    transactionHash: string;
    transactionIndex: string;
  }
  
  interface GetOrdersResponse {
    message: string;
    result: EthEvent[];
    status: string;
  }
  
  type Order = {
    from : string;
    to : string;
    topics : string[];
    txHash : string;
  }

  
  async function getEvents(address: string, baseUrl: string, from: number, to: number | null): Promise<EthEvent[]> {
    let toblockStr
    if (to!== null) toblockStr =`toBlock=${to}`;
    const url = `${baseUrl}/api/api?module=logs&action=getLogs&fromBlock=${from}&${toblockStr}&address=${address}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch logs: ${response.statusText}`);
    }
  
    const data: GetOrdersResponse = await response.json();
  
    if (data.status !== "1") {
      throw new Error(`Error fetching logs: ${data.message}`);
    }
  
    return data.result;
  }
  