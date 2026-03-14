import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { socket } from "../../../websocket/websocket"
import {getNumberQueue, takeNumberQueue} from "../../../api/queue/process.ts";
import {useParams} from "react-router";
import {useState, useEffect} from "react";
export default function QueueProcessNumberPage() {
    const { serviceId = "" } = useParams();

    const [queueNumber, setQueueNumber] = useState(0);

    const fetchQueueNumber = () => {
        getNumberQueue(serviceId).then((queue) => {
            setQueueNumber(queue.number);
        })
    }

    const handleTakeQueueNumber = async () => {
        await takeNumberQueue(serviceId)
    };

    useEffect(() => {
        fetchQueueNumber()
        socket.emit("join-queue-number", serviceId)

        socket.on(`queue-update-${serviceId}`, (data) => {
            if(data.service_id === serviceId) {
                setQueueNumber(data.number);
            }
        });

        return () => {
            socket.off("queue-update");
        };

    }, []);
    return (
        <>
            <PageMeta
                title="Saetechnology - Queue - Service"
                description="Saetechnology - Queue - Service"
            />
            <PageBreadcrumb pageTitle="Queue Process Number" />
                {/* Table */}
            <div className="space-y-6 ">
                <div className="flex flex-col items-center justify-center space-y-6 ">
                    {/* Queue Display Box */}
                    <div className="flex items-center justify-center w-72 h-40 rounded-xl border border-gray-300 bg-white text-5xl font-bold text-gray-800 dark:bg-gray-800 dark:text-white">
                        {queueNumber}
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleTakeQueueNumber}
                        className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                        Take Number Queue
                    </button>

                </div>
            </div>
        </>
    );
}
