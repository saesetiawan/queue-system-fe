import React, {useEffect, useState} from "react";
import {createQueueService, updateQueueService} from "../../../../api/queue/service.ts";
import {AxiosError} from "axios";
import Alert from "../../../../components/ui/alert/Alert.tsx";
import {closeSwalLoading, openSwalLoading} from "../../../../helpers/loading.helper.tsx";
import {showConfirm, showSuccess} from "../../../../helpers/confirm_delete.helper.tsx";
import {QueueServiceForm} from "../../../../types/queue/queue_service.ts";

interface ServiceFormPage {
    setIsModalOpen: (isOpen: boolean) => void;
    isModalOpen: boolean;
    dataEdit?: QueueServiceForm | null;
}

export const ServiceFormPage = ({dataEdit, isModalOpen, setIsModalOpen}: ServiceFormPage) => {
    const [form, setForm] = useState<QueueServiceForm>({ id: "", name: "", description: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const closeModalHandle = () => {
        setErrorMessage("")
        setForm({ id: "", name: "", description: "" })
        setIsModalOpen(false);
    }
    useEffect(() => {
        if(dataEdit) {
            setForm({
                id: `${dataEdit.id}`,
                name: dataEdit.name,
                description: dataEdit.description
            })
        }
    }, [dataEdit]);

    const errorHandler = (err: unknown) => {
        if (err instanceof AxiosError) {
            if(err?.response?.data?.message) {
                if(typeof err?.response?.data?.message === 'string') {
                    setErrorMessage(err?.response?.data?.message as string ?? "");
                } else {
                    setErrorMessage(err?.response?.data?.message[0] as string ?? "");
                }
            }
        } else {
            setErrorMessage("An error occurred. Please try again.");
        }
    }

    const handleSave = async () => {
        const result = showConfirm("Are you sure?", `You want to ${form.id ? "update" : "create"} this category?`, "Yes, create it!", "question")
        if(!result) return
        setIsLoading(true)
        openSwalLoading()
        try {
            if(form.id) {
                await updateQueueService(form.id, form)
            } else {
                await createQueueService(form)
            }
            showSuccess("Success", `Service has been ${form.id ? "updated" : "created"} successfully`)
            closeModalHandle()
        } catch(err) {
            errorHandler(err)
            closeSwalLoading()
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <React.Fragment>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
                        <h2 className="mb-4 text-lg font-semibold">{form.id ? 'Edit' : 'Add'} Service</h2>
                        {errorMessage && (
                            <Alert variant={'error'} title={'Error Validation'} message={errorMessage} />
                        )}
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Name"
                                className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800"
                            />
                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                                placeholder="Description"
                                className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => closeModalHandle()}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isLoading}
                                onClick={handleSave}
                                className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}