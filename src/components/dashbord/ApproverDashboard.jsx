import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, Mail, Calendar, Users, TrendingUp, Filter, Search,
  AlertCircle, CheckCircle, LogOut, Bell, Building2, Stethoscope, 
  X, Menu, LayoutDashboard, Hospital, Loader2, Clock, UserCheck,
  CheckCheck, XCircle, Eye, AwardIcon, ArrowUpRight, FlaskRoundIcon as FlaskIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from 'react-hot-toast';
import { 
  getLeads, updateLeadStatus, updateLeadFollowUp,
  getLeadTypes, getSources, getTodayFollowUps, completeFollowUp,
  getDoctors, getHospitals, approveLead, assignLead, convertLead
} from "../../services/leads";

const ApproverDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("all_leads");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [allLeads, setAllLeads] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [labs, setLabs] = useState([]);
  const [patients, setPatients] = useState([]);
  const [leadTypes, setLeadTypes] = useState([]);
  const [sources, setSources] = useState([]);
  const [todayFollowups, setTodayFollowups] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showApproveModal, setShowApproveModal] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [showConvertModal, setShowConvertModal] = useState(null);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [selectedLeadForFollowup, setSelectedLeadForFollowup] = useState(null);
  const [showUpdateStatus, setShowUpdateStatus] = useState(null);
  const [showLeadDetails, setShowLeadDetails] = useState(null);
  
  const [followupData, setFollowupData] = useState({ next_follow_up: "", follow_up_notes: "" });
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  
  const [stats, setStats] = useState({
    total: 0, pending: 0, approved: 0, rejected: 0
  });

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [leadTypesRes, sourcesRes, leadsRes, todayFollowupsRes, doctorsRes, hospitalsRes] = await Promise.all([
        getLeadTypes(), getSources(), getLeads(), getTodayFollowUps(), getDoctors(), getHospitals()
      ]);
      
      if (leadTypesRes.success) setLeadTypes(leadTypesRes.data);
      if (sourcesRes.success) setSources(sourcesRes.data);
      if (leadsRes.success) {
        setAllLeads(leadsRes.data);
        const data = leadsRes.data;
        setStats({
          total: data.length,
          pending: data.filter(l => l.status === 'pending_verification').length,
          approved: data.filter(l => l.status === 'approved' || l.status === 'assigned' || l.status === 'verified' || l.status === 'converted').length,
          rejected: data.filter(l => l.status === 'rejected').length
        });
      }
      if (todayFollowupsRes.success) setTodayFollowups(todayFollowupsRes.data);
      if (doctorsRes.success) setDoctors(doctorsRes.data);
      if (hospitalsRes.success) setHospitals(hospitalsRes.data);
      
      setPharmacies([
        { id: 1, name: "MedPlus Pharmacy", city: "Hyderabad", phone: "9876543210" },
        { id: 2, name: "hk Pharmacy", city: "Mumbai", phone: "9876543211" }
      ]);
      setLabs([
        { id: 1, name: "Pathology Lab", city: "Delhi", phone: "9876543212" },
        { id: 2, name: "Metropolis Lab", city: "Bangalore", phone: "9876543213" }
      ]);
      setPatients([
        { id: 1, name: "Ramesh Kumar", age: 45, city: "Chennai", phone: "9876543214" }
      ]);
      
      setTeamMembers([
        { id: 13, name: "Team Member 1", email: "team1@crm.com" },
        { id: 14, name: "Team Member 2", email: "team2@crm.com" }
      ]);
      
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // ==================== HANDLERS ====================
  
  const handleApproveLead = async () => {
    try {
      const response = await approveLead(showApproveModal, approvalNotes);
      if (response.success) {
        toast.success("Lead approved successfully!");
        setShowApproveModal(null);
        setApprovalNotes("");
        fetchAllData();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to approve lead");
    }
  };

  const handleAssignLead = async () => {
    if (!selectedTeamMember) {
      toast.error("Please select a team member");
      return;
    }
    try {
      const response = await assignLead(showAssignModal, selectedTeamMember);
      if (response.success) {
        toast.success("Lead assigned successfully!");
        setShowAssignModal(null);
        setSelectedTeamMember("");
        fetchAllData();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to assign lead");
    }
  };

  const handleConvertLead = async () => {
    try {
      const response = await convertLead(showConvertModal);
      if (response.success) {
        toast.success(`Lead converted successfully!`);
        setShowConvertModal(null);
        fetchAllData();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to convert lead");
    }
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      const response = await updateLeadStatus(leadId, newStatus);
      if (response.success) {
        toast.success(`Status updated to ${newStatus}!`);
        setShowUpdateStatus(null);
        fetchAllData();
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleScheduleFollowup = async () => {
    if (!followupData.next_follow_up) {
      toast.error("Please select follow-up date!");
      return;
    }
    setSubmitting(true);
    try {
      const response = await updateLeadFollowUp(selectedLeadForFollowup, followupData.next_follow_up, followupData.follow_up_notes);
      if (response.success) {
        toast.success("Follow-up scheduled successfully!");
        setShowFollowupModal(false);
        setSelectedLeadForFollowup(null);
        setFollowupData({ next_follow_up: "", follow_up_notes: "" });
        fetchAllData();
      } else {
        toast.error(response.message || "Failed to schedule follow-up");
      }
    } catch (error) {
      toast.error("Failed to schedule follow-up");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteFollowup = async (followUpId, leadName) => {
    try {
      const response = await completeFollowUp(followUpId);
      if (response.success) {
        toast.success(`Follow-up completed for ${leadName}!`);
        fetchAllData();
      } else {
        toast.error(response.message || "Failed to complete follow-up");
      }
    } catch (error) {
      toast.error("Failed to complete follow-up");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully!");
  };

  const getFilteredData = () => {
    let data = [];
    if (activeTab === "all_leads") data = allLeads;
    else if (activeTab === "doctors") data = doctors;
    else if (activeTab === "hospitals") data = hospitals;
    else if (activeTab === "pharmacies") data = pharmacies;
    else if (activeTab === "labs") data = labs;
    else if (activeTab === "patients") data = patients;
    else return [];

    return data.filter(item => {
      const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.city?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === "all" || item.lead_type_name === typeFilter;
      const matchesStatus = activeTab !== "all_leads" || statusFilter === "all" || 
                           (statusFilter === "approved" && (item.status === 'approved' || item.status === 'assigned' || item.status === 'verified' || item.status === 'converted')) ||
                           (statusFilter !== "all" && statusFilter !== "approved" && item.status === statusFilter);
      return matchesSearch && matchesType && matchesStatus;
    });
  };

  const filteredData = getFilteredData();

  const getStatusBadge = (status) => {
    let displayStatus = status;
    let colorClass = "";
    
    if (status === 'pending_verification') {
      displayStatus = "Pending";
      colorClass = "bg-yellow-50 text-yellow-700 border-yellow-200";
    } else if (status === 'approved') {
      displayStatus = "Approved";
      colorClass = "bg-blue-50 text-blue-700 border-blue-200";
    } else if (status === 'assigned') {
      displayStatus = "Assigned";
      colorClass = "bg-purple-50 text-purple-700 border-purple-200";
    } else if (status === 'verified') {
      displayStatus = "Verified";
      colorClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
    } else if (status === 'converted') {
      displayStatus = "Converted";
      colorClass = "bg-green-50 text-green-700 border-green-200";
    } else if (status === 'rejected') {
      displayStatus = "Rejected";
      colorClass = "bg-red-50 text-red-700 border-red-200";
    } else {
      displayStatus = status?.replace("_", " ") || "Unknown";
      colorClass = "bg-gray-50 text-gray-700 border-gray-200";
    }
    
    return (
      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${colorClass}`}>
        {displayStatus}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = { high: "text-red-600 bg-red-50", medium: "text-yellow-600 bg-yellow-50", low: "text-green-600 bg-green-50" };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[priority] || "text-gray-600 bg-gray-50"}`}>{priority?.toUpperCase() || "MEDIUM"}</span>;
  };

  const getLeadTypeIcon = (typeName) => {
    const icons = { doctor: <Stethoscope className="w-4 h-4" />, hospital: <Hospital className="w-4 h-4" />, pharmacy: <Building2 className="w-4 h-4" />, lab: <FlaskIcon className="w-4 h-4" />, patient: <Users className="w-4 h-4" /> };
    return icons[typeName] || <Users className="w-4 h-4" />;
  };

  const getTabIcon = (tab) => {
    const icons = { all_leads: <LayoutDashboard className="w-5 h-5" />, doctors: <Stethoscope className="w-5 h-5" />, hospitals: <Hospital className="w-5 h-5" />, pharmacies: <Building2 className="w-5 h-5" />, labs: <FlaskIcon className="w-5 h-5" />, patients: <Users className="w-5 h-5" /> };
    return icons[tab] || <LayoutDashboard className="w-5 h-5" />;
  };

  const renderTableRow = (item) => {
    if (activeTab === "all_leads") {
      return (
        <tr key={item.id} className="border-t hover:bg-gray-50 transition-colors">
          <td className="px-4 py-3">
            <div className="font-medium text-gray-900 text-sm">{item.name}</div>
            <div className="text-xs text-gray-500 md:hidden">{item.lead_type_name}</div>
            {item.phone && <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Phone className="w-3 h-3" /> {item.phone}</div>}
           </td>
          <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell"><span className="flex items-center gap-1.5">{getLeadTypeIcon(item.lead_type_name)} {item.lead_type_name}</span></td>
          <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{item.city || "-"}</td>
          <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
          <td className="px-4 py-3 hidden sm:table-cell">{getPriorityBadge(item.priority)}</td>
          <td className="px-4 py-3">
            <div className="flex gap-2">
              <button onClick={() => setShowLeadDetails(item)} className="p-1 text-gray-400 hover:text-blue-600" title="View Details"><Eye className="w-4 h-4" /></button>
              <button onClick={() => { setSelectedLeadForFollowup(item.id); setShowFollowupModal(true); }} className="p-1 text-gray-400 hover:text-green-600" title="Schedule Follow-up"><Calendar className="w-4 h-4" /></button>
              <button onClick={() => setShowUpdateStatus(item.id)} className="p-1 text-gray-400 hover:text-blue-600" title="Update Status"><CheckCheck className="w-4 h-4" /></button>
              
              {item.status === 'pending_verification' && (
                <button onClick={() => setShowApproveModal(item.id)} className="p-1 text-gray-400 hover:text-blue-600" title="Approve Lead">
                  <AwardIcon className="w-4 h-4" />
                </button>
              )}
              
              {item.status === 'approved' && (
                <button onClick={() => setShowAssignModal(item.id)} className="p-1 text-gray-400 hover:text-purple-600" title="Assign to Worker">
                  <UserCheck className="w-4 h-4" />
                </button>
              )}
              
              {item.status === 'verified' && (
                <button onClick={() => setShowConvertModal(item.id)} className="p-1 text-gray-400 hover:text-green-600" title="Convert Lead">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    }
    return null;
  };

  const renderTableHeaders = () => {
    if (activeTab === "all_leads") {
      return (
        <>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name / Contact</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Type</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">City</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Priority</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
        </>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">MedBridge CRM</h1>
            <p className="text-xs text-gray-500">Approver Dashboard | Welcome, {user?.name || "Approver"}! 👋</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600">
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 py-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCardSmall title="Total" value={stats.total} icon={Users} color="blue" />
          <StatCardSmall title="Pending" value={stats.pending} icon={Clock} color="yellow" />
          <StatCardSmall title="Approved" value={stats.approved} icon={CheckCircle} color="green" />
          <StatCardSmall title="Rejected" value={stats.rejected} icon={XCircle} color="red" />
        </div>

        {/* Today's Follow-ups */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <div><h2 className="text-base font-semibold">Today's Follow-ups</h2><p className="text-xs text-gray-500">{todayFollowups.length} pending tasks</p></div>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="divide-y max-h-[300px] overflow-y-auto">
            {todayFollowups.length > 0 ? todayFollowups.map((item) => (
              <div key={item.id} className="p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div><h3 className="font-medium text-sm">{item.name}</h3><p className="text-xs text-gray-500">{item.city}</p>{item.follow_up_notes && <p className="text-xs text-blue-600 mt-1">📝 {item.follow_up_notes}</p>}</div>
                  <button onClick={() => handleCompleteFollowup(item.follow_up_id, item.name)} className="px-2 py-1 text-xs bg-green-600 text-white rounded-lg">Complete</button>
                </div>
              </div>
            )) : <div className="text-center py-8"><CheckCircle className="w-10 h-10 text-gray-200 mx-auto mb-2" /><p className="text-gray-500 text-sm">No follow-ups for today</p></div>}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-nowrap overflow-x-auto gap-2 mb-4 pb-2">
          {["all_leads", "doctors", "hospitals", "pharmacies", "labs", "patients"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white border text-gray-600"}`}>
              {getTabIcon(tab)} <span>{tab === "all_leads" ? "All Leads" : tab.replace("_", " ")}</span>
            </button>
          ))}
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between gap-3">
            <h2 className="text-base font-semibold capitalize">{activeTab === "all_leads" ? "All Leads" : activeTab.replace("_", " ")}</h2>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-56"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg" /></div>
              {activeTab === "all_leads" && (
                <>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 text-sm border rounded-lg">
                    <option value="all">All Status</option>
                    <option value="pending_verification">Pending</option>
                    {/* <option value="approved">Approved</option> */}
                    {/* <option value="assigned">Assigned</option> */}
                    <option value="verified">Verified</option>
                    <option value="converted">Converted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-1.5 text-sm border rounded-lg">
                    <option value="all">All Types</option>
                    {leadTypes.map(type => <option key={type.id} value={type.name}>{type.name}</option>)}
                  </select>
                </>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead className="bg-gray-50 border-b">{renderTableHeaders()}</thead>
              <tbody>{filteredData.length > 0 ? filteredData.map(item => renderTableRow(item)) : <tr><td colSpan="6" className="text-center py-8 text-gray-500">No leads found</td></tr>} </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      <AnimatePresence>{showApproveModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-md w-full p-5"><h3 className="text-lg font-semibold mb-4">Approve Lead</h3><textarea placeholder="Approval notes..." value={approvalNotes} onChange={(e) => setApprovalNotes(e.target.value)} rows="3" className="w-full px-3 py-2 border rounded-lg mb-4" /><div className="flex gap-3"><button onClick={handleApproveLead} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Approve</button><button onClick={() => { setShowApproveModal(null); setApprovalNotes(""); }} className="flex-1 bg-gray-100 py-2 rounded-lg">Cancel</button></div></motion.div></motion.div>)}</AnimatePresence>

      {/* Assign Modal */}
      <AnimatePresence>{showAssignModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-md w-full p-5"><h3 className="text-lg font-semibold mb-4">Assign Lead to Worker</h3><select value={selectedTeamMember} onChange={(e) => setSelectedTeamMember(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-4"><option value="">Select Team Member</option>{teamMembers.map(m => <option key={m.id} value={m.id}>{m.name} (ID: {m.id})</option>)}</select><div className="flex gap-3"><button onClick={handleAssignLead} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Assign</button><button onClick={() => { setShowAssignModal(null); setSelectedTeamMember(""); }} className="flex-1 bg-gray-100 py-2 rounded-lg">Cancel</button></div></motion.div></motion.div>)}</AnimatePresence>

      {/* Convert Modal */}
      <AnimatePresence>{showConvertModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-md w-full p-5"><h3 className="text-lg font-semibold mb-4">Convert Lead</h3><p className="text-gray-600 mb-4 text-sm">This lead will be converted to final table.</p><div className="flex gap-3"><button onClick={handleConvertLead} className="flex-1 bg-green-600 text-white py-2 rounded-lg">Convert</button><button onClick={() => setShowConvertModal(null)} className="flex-1 bg-gray-100 py-2 rounded-lg">Cancel</button></div></motion.div></motion.div>)}</AnimatePresence>

      {/* Schedule Follow-up Modal */}
      <AnimatePresence>{showFollowupModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-md w-full p-5"><h3 className="text-lg font-semibold mb-4">Schedule Follow-up</h3><input type="date" value={followupData.next_follow_up} onChange={(e) => setFollowupData({...followupData, next_follow_up: e.target.value})} className="w-full px-3 py-2 border rounded-lg mb-3" min={new Date().toISOString().split('T')[0]} /><textarea placeholder="Notes" value={followupData.follow_up_notes} onChange={(e) => setFollowupData({...followupData, follow_up_notes: e.target.value})} rows="3" className="w-full px-3 py-2 border rounded-lg mb-4" /><div className="flex gap-3"><button onClick={handleScheduleFollowup} disabled={submitting} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">{submitting ? "Scheduling..." : "Schedule"}</button><button onClick={() => { setShowFollowupModal(false); setFollowupData({ next_follow_up: "", follow_up_notes: "" }); }} className="flex-1 bg-gray-100 py-2 rounded-lg">Cancel</button></div></motion.div></motion.div>)}</AnimatePresence>

      {/* Update Status Modal */}
      <AnimatePresence>{showUpdateStatus && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-sm w-full p-5"><h2 className="text-lg font-semibold mb-4">Update Status</h2><div className="space-y-2">{["pending_verification", "approved", "assigned", "verified", "converted", "rejected"].map((status) => (<button key={status} onClick={() => handleUpdateStatus(showUpdateStatus, status)} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 capitalize text-gray-700 text-sm">{status.replace("_", " ")}</button>))}</div><button onClick={() => setShowUpdateStatus(null)} className="w-full mt-4 bg-gray-100 py-2 rounded-lg">Cancel</button></motion.div></motion.div>)}</AnimatePresence>

      {/* Lead Details Modal */}
      <AnimatePresence>{showLeadDetails && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-2xl w-full p-5 max-h-[80vh] overflow-y-auto"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Lead Details</h3><button onClick={() => setShowLeadDetails(null)}><X className="w-5 h-5" /></button></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><p className="text-xs text-gray-500">Name</p><p className="font-medium text-sm">{showLeadDetails.name}</p></div><div><p className="text-xs text-gray-500">Type</p><p className="font-medium text-sm capitalize">{showLeadDetails.lead_type_name}</p></div><div><p className="text-xs text-gray-500">Phone</p><p className="text-sm">{showLeadDetails.phone || "-"}</p></div><div><p className="text-xs text-gray-500">Email</p><p className="text-sm">{showLeadDetails.email || "-"}</p></div><div><p className="text-xs text-gray-500">City</p><p className="text-sm">{showLeadDetails.city || "-"}</p></div><div><p className="text-xs text-gray-500">Status</p>{getStatusBadge(showLeadDetails.status)}</div><div><p className="text-xs text-gray-500">Priority</p>{getPriorityBadge(showLeadDetails.priority)}</div><div><p className="text-xs text-gray-500">Created At</p><p className="text-sm">{new Date(showLeadDetails.created_at).toLocaleString()}</p></div></div></motion.div></motion.div>)}</AnimatePresence>
    </div>
  );
};

const StatCardSmall = ({ title, value, icon: Icon, color }) => {
  const colors = { blue: "bg-blue-50 text-blue-600", yellow: "bg-yellow-50 text-yellow-600", green: "bg-green-50 text-green-600", red: "bg-red-50 text-red-600" };
  return (
    <div className="bg-white rounded-xl border p-3 hover:shadow-md transition-all">
      <div className="flex justify-between items-center">
        <div><p className="text-[10px] text-gray-500">{title}</p><p className="text-lg font-bold">{value}</p></div>
        <div className={`w-8 h-8 ${colors[color]} rounded-lg flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
      </div>
    </div>
  );
};

export default ApproverDashboard;


















