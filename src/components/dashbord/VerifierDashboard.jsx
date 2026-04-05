import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, Mail, Calendar, Users, UserPlus, TrendingUp, Filter, Search,
  AlertCircle, CheckCircle, LogOut, Bell, Building2, Stethoscope, 
  X, Menu, LayoutDashboard, Hospital, Loader2, Clock, UserCheck,
  CheckCheck, XCircle, UserRound, UsersRound, Eye, AwardIcon, ArrowUpRight,
  FileText, MapPin, Camera, PhoneCall, Activity, History, ThumbsUp, ThumbsDown,
  Clock as ClockIcon, Repeat, Flag, CalendarDays, MessageSquare, Plus,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from 'react-hot-toast';
import { 
  getMyAssignedLeads, updateLeadStatus, getTodayFollowUps, completeFollowUp,
  updateLeadFollowUp, getLeadActivities
} from "../../services/leads";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [todayFollowups, setTodayFollowups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showActivityModal, setShowActivityModal] = useState(null);
  const [showLeadDetails, setShowLeadDetails] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [selectedLeadForFollowup, setSelectedLeadForFollowup] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [leadActivities, setLeadActivities] = useState([]);
  
  // Form States for Activity
  const [activityData, setActivityData] = useState({
    action_type: "visit",
    visit_type: "physical",
    doctor_status: "interested",
    notes: "",
    next_follow_up: "",
    discussion_topic: ""
  });
  
  const [followupData, setFollowupData] = useState({
    next_follow_up: "",
    follow_up_notes: ""
  });
  
  // Stats
  const [stats, setStats] = useState({
    assigned: 0,
    interested: 0,
    not_interested: 0,
    followup: 0,
    total: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignedRes, followupsRes] = await Promise.all([
        getMyAssignedLeads(),
        getTodayFollowUps()
      ]);
      
      if (assignedRes.success) {
        const data = assignedRes.data || [];
        setAssignedLeads(data);
        setStats({
          assigned: data.length,
          interested: data.filter(l => l.doctor_status === 'interested' || l.status === 'interested').length,
          not_interested: data.filter(l => l.doctor_status === 'not_interested' || l.status === 'not_interested').length,
          followup: data.filter(l => l.doctor_status === 'followup' || l.status === 'followup').length,
          total: data.length
        });
      }
      if (followupsRes.success) {
        setTodayFollowups(followupsRes.data || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Update Doctor Status (Interested/Not Interested/Follow-up)
  const handleUpdateDoctorStatus = async (leadId, doctorStatus, notes = "") => {
    setSubmitting(true);
    try {
      let newStatus = 'assigned';
      let statusMessage = "";
      
      switch (doctorStatus) {
        case 'interested':
          newStatus = 'assigned';
          statusMessage = "Marked as Interested";
          break;
        case 'not_interested':
          newStatus = 'assigned';
          statusMessage = "Marked as Not Interested";
          break;
        case 'followup':
          newStatus = 'assigned';
          statusMessage = "Marked as Follow-up";
          break;
        default:
          newStatus = 'assigned';
      }
      
      await updateLeadStatus(leadId, newStatus, `${doctorStatus}: ${notes || statusMessage}`);
      toast.success(`Lead marked as ${doctorStatus.replace('_', ' ')}!`);
      fetchData();
    } catch (error) {
      console.error("Update Status Error:", error);
      toast.error("Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  // Add Activity (Visit/Call) with full details
  const handleAddActivity = async () => {
    if (!activityData.doctor_status) {
      toast.error("Please select doctor status!");
      return;
    }

    setSubmitting(true);
    try {
      const leadId = showActivityModal;
      let newStatus = 'assigned';
      
      switch (activityData.doctor_status) {
        case 'interested':
          newStatus = 'assigned';
          break;
        case 'not_interested':
          newStatus = 'assigned';
          break;
        case 'followup':
          newStatus = 'assigned';
          break;
        default:
          newStatus = 'assigned';
      }
      
      const activityNotes = `${activityData.action_type} (${activityData.visit_type}): ${activityData.discussion_topic ? 'Topic: ' + activityData.discussion_topic + '. ' : ''}${activityData.notes}`;
      
      await updateLeadStatus(leadId, newStatus, `${activityData.doctor_status}: ${activityNotes}`);
      
      if (activityData.next_follow_up) {
        await updateLeadFollowUp(leadId, activityData.next_follow_up, 
          `Follow-up from ${activityData.action_type} on ${new Date().toLocaleDateString()}: ${activityData.notes}`);
      }
      
      toast.success(`Activity recorded! Doctor status: ${activityData.doctor_status}`);
      setShowActivityModal(null);
      setActivityData({
        action_type: "visit",
        visit_type: "physical",
        doctor_status: "interested",
        notes: "",
        next_follow_up: "",
        discussion_topic: ""
      });
      fetchData();
    } catch (error) {
      console.error("Add Activity Error:", error);
      toast.error("Failed to record activity");
    } finally {
      setSubmitting(false);
    }
  };

  // View Lead Activity History
  const handleViewHistory = async (leadId) => {
    try {
      const response = await getLeadActivities(leadId);
      if (response.success) {
        setLeadActivities(response.data || []);
        setShowHistoryModal(leadId);
      } else {
        setLeadActivities([]);
        setShowHistoryModal(leadId);
      }
    } catch (error) {
      console.error("Fetch History Error:", error);
      setLeadActivities([]);
      setShowHistoryModal(leadId);
    }
  };

  const handleScheduleFollowup = async () => {
    if (!followupData.next_follow_up) {
      toast.error("Please select follow-up date!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await updateLeadFollowUp(
        selectedLeadForFollowup, 
        followupData.next_follow_up, 
        followupData.follow_up_notes
      );
      if (response.success) {
        toast.success("Follow-up scheduled successfully!");
        setShowFollowupModal(false);
        setSelectedLeadForFollowup(null);
        setFollowupData({ next_follow_up: "", follow_up_notes: "" });
        fetchData();
      } else {
        toast.error(response.message || "Failed to schedule follow-up");
      }
    } catch (error) {
      console.error("Schedule Follow-up Error:", error);
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
        fetchData();
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

  const getDoctorStatusBadge = (status) => {
    if (!status) return null;
    const colors = {
      interested: "bg-green-50 text-green-700 border-green-200",
      not_interested: "bg-red-50 text-red-700 border-red-200",
      followup: "bg-yellow-50 text-yellow-700 border-yellow-200",
      pending: "bg-gray-50 text-gray-700 border-gray-200"
    };
    const labels = {
      interested: "Interested",
      not_interested: "Not Interested",
      followup: "Follow-up",
      pending: "Pending"
    };
    return (
      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${colors[status] || colors.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: "text-red-600 bg-red-50",
      medium: "text-yellow-600 bg-yellow-50",
      low: "text-green-600 bg-green-50"
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[priority] || "text-gray-600 bg-gray-50"}`}>
        {priority?.toUpperCase() || "MEDIUM"}
      </span>
    );
  };

  const getLeadTypeIcon = (typeName) => {
    const icons = { 
      doctor: <Stethoscope className="w-4 h-4" />, 
      hospital: <Hospital className="w-4 h-4" />, 
      pharmacy: <Building2 className="w-4 h-4" />, 
      lab: <Building2 className="w-4 h-4" />, 
      patient: <Users className="w-4 h-4" /> 
    };
    return icons[typeName] || <Users className="w-4 h-4" />;
  };

  const filteredLeads = assignedLeads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              MedBridge CRM
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Worker Dashboard | Welcome, {user?.name || "Team Member"}! 👋
            </p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCardSmall title="Total Assigned" value={stats.total} icon={Users} color="blue" />
          <StatCardSmall title="Interested" value={stats.interested} icon={ThumbsUp} color="green" />
          <StatCardSmall title="Not Interested" value={stats.not_interested} icon={ThumbsDown} color="red" />
          <StatCardSmall title="Follow-ups" value={stats.followup} icon={Repeat} color="yellow" />
        </div>

        {/* Today's Follow-ups Section */}
        {todayFollowups.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Today's Follow-ups</h2>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">{todayFollowups.length} pending tasks</p>
            </div>
            <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
              {todayFollowups.map((item) => (
                <div key={item.follow_up_id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.follow_up_notes}</p>
                    </div>
                    <button
                      onClick={() => handleCompleteFollowup(item.follow_up_id, item.name)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-5 border-b flex flex-col sm:flex-row justify-between gap-4">
            <h2 className="text-lg font-semibold">My Assigned Leads</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assigned leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name / Contact</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">City</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Priority</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        {lead.phone && <div className="text-xs text-gray-400 mt-1">{lead.phone}</div>}
                        {lead.doctor_status && (
                          <div className="mt-1">{getDoctorStatusBadge(lead.doctor_status)}</div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">
                        <span className="flex items-center gap-1.5">
                          {getLeadTypeIcon(lead.lead_type_name)} {lead.lead_type_name}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 hidden lg:table-cell">{lead.city || "-"}</td>
                      <td className="px-5 py-4">{getDoctorStatusBadge(lead.doctor_status || 'pending')}</td>
                      <td className="px-5 py-4 hidden sm:table-cell">{getPriorityBadge(lead.priority)}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          {/* View Details */}
                          <button
                            onClick={() => setShowLeadDetails(lead)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {/* View History */}
                          <button
                            onClick={() => handleViewHistory(lead.id)}
                            className="p-1 text-gray-400 hover:text-purple-600"
                            title="View History"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          
                          {/* Schedule Follow-up */}
                          <button
                            onClick={() => {
                              setSelectedLeadForFollowup(lead.id);
                              setShowFollowupModal(true);
                            }}
                            className="p-1 text-gray-400 hover:text-green-600"
                            title="Schedule Follow-up"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                          
                          {/* Quick Status Buttons */}
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleUpdateDoctorStatus(lead.id, 'interested')}
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
                              title="Mark as Interested"
                            >
                              <ThumbsUp className="w-3 h-3" /> Int
                            </button>
                            <button
                              onClick={() => handleUpdateDoctorStatus(lead.id, 'not_interested')}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700"
                              title="Mark as Not Interested"
                            >
                              <ThumbsDown className="w-3 h-3" /> Not Int
                            </button>
                            <button
                              onClick={() => handleUpdateDoctorStatus(lead.id, 'followup')}
                              className="px-2 py-1 text-xs bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                              title="Mark as Follow-up"
                            >
                              <Repeat className="w-3 h-3" /> F/up
                            </button>
                          </div>
                          
                          {/* Add Activity Button */}
                          <button
                            onClick={() => setShowActivityModal(lead.id)}
                            className="px-3 py-1 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                          >
                            Add Activity
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center">
                      <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-500">No leads assigned to you yet</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {showActivityModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Record Doctor Visit</h3>
                <button onClick={() => setShowActivityModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Visit Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visit Type</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActivityData({...activityData, action_type: "visit", visit_type: "physical"})}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border transition-all ${
                        activityData.action_type === "visit" && activityData.visit_type === "physical"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <MapPin className="w-4 h-4" /> Physical Visit
                    </button>
                    <button
                      onClick={() => setActivityData({...activityData, action_type: "call", visit_type: "phone"})}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border transition-all ${
                        activityData.action_type === "call"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <PhoneCall className="w-4 h-4" /> Phone Call
                    </button>
                  </div>
                </div>

                {/* Doctor Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Status *</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setActivityData({...activityData, doctor_status: "interested"})}
                      className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                        activityData.doctor_status === "interested"
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" /> Interested
                    </button>
                    <button
                      onClick={() => setActivityData({...activityData, doctor_status: "not_interested"})}
                      className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                        activityData.doctor_status === "not_interested"
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" /> Not Interested
                    </button>
                    <button
                      onClick={() => setActivityData({...activityData, doctor_status: "followup"})}
                      className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                        activityData.doctor_status === "followup"
                          ? "bg-yellow-600 text-white border-yellow-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Repeat className="w-4 h-4" /> Follow-up
                    </button>
                  </div>
                </div>

                {/* Discussion Topic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discussion Topic</label>
                  <input
                    type="text"
                    placeholder="e.g., New Medicine Demo, Product Presentation"
                    value={activityData.discussion_topic}
                    onChange={(e) => setActivityData({...activityData, discussion_topic: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    placeholder="Enter visit details, doctor feedback, medicine samples given..."
                    value={activityData.notes}
                    onChange={(e) => setActivityData({...activityData, notes: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Next Follow-up Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={activityData.next_follow_up}
                    onChange={(e) => setActivityData({...activityData, next_follow_up: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddActivity}
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Save Activity"}
                  </button>
                  <button
                    onClick={() => setShowActivityModal(null)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Activity History</h3>
                <button onClick={() => setShowHistoryModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {leadActivities.length > 0 ? (
                <div className="space-y-3">
                  {leadActivities.map((activity, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {activity.action_type === 'visit' && <MapPin className="w-4 h-4 text-blue-500" />}
                          {activity.action_type === 'call' && <PhoneCall className="w-4 h-4 text-green-500" />}
                          {activity.action_type === 'followup' && <Repeat className="w-4 h-4 text-yellow-500" />}
                          <span className="font-medium capitalize">{activity.action_type}</span>
                          {activity.visit_type && (
                            <span className="text-xs text-gray-500">({activity.visit_type})</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(activity.created_at).toLocaleString()}
                        </span>
                      </div>
                      {activity.doctor_status && (
                        <div className="mb-2">{getDoctorStatusBadge(activity.doctor_status)}</div>
                      )}
                      {activity.notes && (
                        <p className="text-sm text-gray-600 mt-2">{activity.notes}</p>
                      )}
                      {activity.next_follow_up && (
                        <p className="text-xs text-blue-500 mt-1">Next Follow-up: {new Date(activity.next_follow_up).toLocaleDateString()}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500">No activities recorded yet</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Details Modal */}
      <AnimatePresence>
        {showLeadDetails && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Lead Details</h3>
                <button onClick={() => setShowLeadDetails(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{showLeadDetails.name}</p></div>
                <div><p className="text-sm text-gray-500">Type</p><p className="font-medium capitalize">{showLeadDetails.lead_type_name}</p></div>
                <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{showLeadDetails.phone || "-"}</p></div>
                <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{showLeadDetails.email || "-"}</p></div>
                <div><p className="text-sm text-gray-500">City</p><p className="font-medium">{showLeadDetails.city || "-"}</p></div>
                <div><p className="text-sm text-gray-500">Status</p><p>{getDoctorStatusBadge(showLeadDetails.doctor_status || 'pending')}</p></div>
                <div><p className="text-sm text-gray-500">Priority</p><p>{getPriorityBadge(showLeadDetails.priority)}</p></div>
                <div><p className="text-sm text-gray-500">Assigned At</p><p className="text-sm">{showLeadDetails.assigned_at ? new Date(showLeadDetails.assigned_at).toLocaleString() : "-"}</p></div>
              </div>
              {showLeadDetails.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-sm">{showLeadDetails.notes}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Follow-up Modal */}
      <AnimatePresence>
        {showFollowupModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold mb-4">Schedule Follow-up</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date *</label>
                  <input
                    type="date"
                    value={followupData.next_follow_up}
                    onChange={(e) => setFollowupData({...followupData, next_follow_up: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    placeholder="What needs to be done?"
                    value={followupData.follow_up_notes}
                    onChange={(e) => setFollowupData({...followupData, follow_up_notes: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleScheduleFollowup} disabled={submitting} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">
                    {submitting ? "Scheduling..." : "Schedule Follow-up"}
                  </button>
                  <button onClick={() => { setShowFollowupModal(false); setFollowupData({ next_follow_up: "", follow_up_notes: "" }); }} className="flex-1 bg-gray-100 py-2 rounded-lg">Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCardSmall = ({ title, value, icon: Icon, color }) => {
  const colors = { 
    blue: "bg-blue-50 text-blue-600", 
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600"
  };
  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 ${colors[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;



























