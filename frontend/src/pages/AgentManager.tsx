import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

interface Agent {
  id: number;
  name: string;
  type: string;
  status: string;
  config: string;
  createdAt: string;
  updatedAt: string;
}

const defaultAgent = {
  name: '',
  type: '',
  status: 'active',
  config: '',
};

const AgentManager: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [form, setForm] = useState<typeof defaultAgent>(defaultAgent);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch agents
  const fetchAgents = async () => {
    setLoading(true);
    const res = await fetch('/api/agents');
    const data = await res.json();
    setAgents(data);
    setLoading(false);
  };

  useEffect(() => { fetchAgents(); }, []);

  // Open modal for add/edit
  const openModal = (agent?: Agent) => {
    if (agent) {
      setEditAgent(agent);
      setForm({
        name: agent.name,
        type: agent.type,
        status: agent.status,
        config: agent.config || '',
      });
    } else {
      setEditAgent(null);
      setForm(defaultAgent);
    }
    setModalOpen(true);
  };

  // Save agent (add or edit)
  const saveAgent = async () => {
    setSaving(true);
    const method = editAgent ? 'PUT' : 'POST';
    const url = editAgent ? `/api/agents/${editAgent.id}` : '/api/agents';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setModalOpen(false);
      fetchAgents();
    }
    setSaving(false);
  };

  // Delete agent
  const confirmDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/agents/${deleteId}`, { method: 'DELETE' });
    setDeleteId(null);
    fetchAgents();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-[#181c2a] dark:via-[#232946] dark:to-blue-950">
      <div className="w-full mx-auto p-4 md:p-8 md:max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-orange-300">Agent Management</h2>
          <Button variant="primary" onClick={() => openModal()}>Add Agent</Button>
        </div>
        <Card className="p-0 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-100 dark:bg-blue-900">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Config</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(agent => (
                <tr key={agent.id} className="border-b border-blue-100 dark:border-blue-800">
                  <td className="px-4 py-2 font-semibold">{agent.name}</td>
                  <td className="px-4 py-2">{agent.type}</td>
                  <td className="px-4 py-2">{agent.status}</td>
                  <td className="px-4 py-2 truncate max-w-xs">{agent.config}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button variant="secondary" onClick={() => openModal(agent)}>Edit</Button>
                    <Button variant="danger" onClick={() => setDeleteId(agent.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
              {agents.length === 0 && !loading && (
                <tr><td colSpan={5} className="text-center py-8 text-blue-400">No agents found.</td></tr>
              )}
              {loading && (
                <tr><td colSpan={5} className="text-center py-8 text-blue-400">Loading...</td></tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* Add/Edit Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editAgent ? 'Edit Agent' : 'Add Agent'}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" className="w-full px-3 py-2 rounded border" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <input type="text" className="w-full px-3 py-2 rounded border" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select className="w-full px-3 py-2 rounded border" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Config (JSON)</label>
              <textarea className="w-full px-3 py-2 rounded border font-mono" rows={3} value={form.config} onChange={e => setForm(f => ({ ...f, config: e.target.value }))} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={saveAgent}>{editAgent ? 'Save Changes' : 'Add Agent'}</Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Agent?">
          <div className="space-y-4">
            <p>Are you sure you want to delete this agent? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AgentManager; 