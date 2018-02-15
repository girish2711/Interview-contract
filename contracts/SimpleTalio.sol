pragma solidity ^0.4.18;

library Set {
    
    struct Data 
    { 
        string applicantName;
        bool isApplied;
        bool isInterViewPassed;
        uint8 interviewCounts;
    }
    
    struct ApplicantData { mapping(uint => Data) flags; }

    
    function addApplicant(ApplicantData storage self, uint ssn,string name)
    public 
    returns (bool)
    {
        if (self.flags[ssn].isApplied) 
            return false; // Data present here
        self.flags[ssn].isApplied = true;
        self.flags[ssn].applicantName = name;
        self.flags[ssn].isInterViewPassed = false;
        self.flags[ssn].interviewCounts = 0;
        return true;
    }
    
    function addInterviewerResult(ApplicantData storage self,uint ssn, bool result)
    public
    {
        self.flags[ssn].isInterViewPassed = result;
    }
    
    function canAddInterviewFeedback(ApplicantData storage self,uint ssn) 
    public
    constant
    returns (bool)
    {
        if (self.flags[ssn].isApplied) {
            // max only 2 interview possible else throw
            require(self.flags[ssn].interviewCounts < 2); 
                // No previous interviews are failed
                if (self.flags[ssn].interviewCounts > 0) {
                    require (self.flags[ssn].isInterViewPassed); 
                }
                return true;
        }
        return false;
    }

    function getInterviewResult(ApplicantData storage self,uint ssn)
    public
    constant returns(int8)
    {
        uint intCount = self.flags[ssn].interviewCounts;
        if (intCount == 0) {
            return 0; // Interviews pending
        } else if (intCount == 1) {
            if (self.flags[ssn].isInterViewPassed) {
                return 1; // to next level
            }
            return -1; // Fail
        } else {
            if (self.flags[ssn].isInterViewPassed) {
                return 2; // selected
            }
            return -2; // Candidate rejected in second interview
        }
    }

    function contains(ApplicantData storage self, uint ssn) 
    public 
    constant returns (bool)
    {
        return self.flags[ssn].isApplied;
    }
}

contract Talio {
    
    event notifyInterviewers(uint jobId, uint ssn);
    event notifyCandidate(uint jobId, uint ssn, string result);
    
    uint constant maxJobTypes = 5;
    address talioOwner;
    
    // Only once a candidate can apply for a position
    using Set for Set.ApplicantData;
    mapping(uint => Set.ApplicantData) applications;

    // Structure job openings  in the company
    struct Opening {
        uint8 jobType;
        bool isFilled;
        uint8 numberOfApplicants;
    }
    
    struct interviewSchedule {
        uint jobId;
        uint ssn;
    }
    
    Opening[] openings;
    address[] interviewers;
    
    mapping(uint => interviewSchedule[]) schedules;
    // Max 5 types of jobs 
    uint[][maxJobTypes] applicants; // !! Note Opposite way of declaring !! 

    modifier onlyIfTalioOwner() {
        require(msg.sender == talioOwner);
        _;
    }
    
    modifier ifNotAlreadyAppliedForThisJob(uint ssn, uint jobId) {
        require(!applications[jobId].contains(ssn));
        _;
    }
    
    modifier ifInterviewersAvailable() {
        require(interviewers.length > 0);
        _;
    }
    
    modifier ifInterviewerNumberAvailable(uint position) {
        require(position <= interviewers.length );
        require(position >= 0 );
        require(position < maxJobTypes); // MAX number of possible interviewers (1 per job type)
        _;
    }
    
    modifier onlyIfAuthorizedInterviewer(uint jobId, uint ssn) {
        // Assumption : Same person will interview twice
         require (interviewers[openings[jobId].jobType] == msg.sender);
        _;
    }    
    
    function Talio() 
    public
    {
        talioOwner = msg.sender;
    }
    
    function addInterviewer(address newInterviewer, uint interviewerNumber) public
    onlyIfTalioOwner()
    ifInterviewerNumberAvailable(interviewerNumber)
    {
        if (interviewerNumber == interviewers.length)
        {
            interviewers.push(newInterviewer);
        }
        else
        {
            interviewers[interviewerNumber] = newInterviewer;
        }
    }

    
    function openNewPosition(uint8 jobType) 
    public onlyIfTalioOwner
    {
        Opening memory newOpeninng;
        
        newOpeninng.jobType = jobType;
        newOpeninng.isFilled = false;
        newOpeninng.numberOfApplicants = 0;
        
        openings.push(newOpeninng);
        
    }
    
    function createNewApplication(uint jobId, uint ssn, string name)
    internal
    {
        applications[jobId].addApplicant(ssn, name);
        openings[jobId].numberOfApplicants++;
    }
    
    function applyForJob(uint jobId, uint ssn, string name) 
    public
    ifNotAlreadyAppliedForThisJob(ssn,jobId)
    ifInterviewersAvailable()
    {
        
        createNewApplication(jobId,ssn,name);
        
        applicants[uint(openings[jobId].jobType)].push(ssn);
        interviewSchedule memory newSchedule;
        newSchedule.jobId = jobId;
        newSchedule.ssn = ssn;
        schedules[openings[jobId].jobType].push(newSchedule);
        
        notifyInterviewers(jobId, ssn);

    }
    
    // Tansactions for interviewer
    
    function sendFeedback(uint jobid, uint ssn, bool isSelected)
    public 
    onlyIfAuthorizedInterviewer(jobid,ssn)
    returns(string)
    {
       string memory result = "All interviews are over for this candidate";

        if (applications[jobid].canAddInterviewFeedback(ssn)) {
            applications[jobid].addInterviewerResult(ssn,isSelected);
            result = "Congratulations, Please wait for next interview"; // case 1
            int intResult = applications[jobid].getInterviewResult(ssn);
            if (intResult < 0) {
                result = "Sorry!, Please try your luck again";
            } else if (intResult == 2) {
                result = "Congratulations, We are happy to offer this job";
            }
            notifyCandidate(jobid,ssn,result);
        }
        return result;
    }
    
    function readMaxOpenings() 
    public
    constant
    returns (uint)
    {
        return openings.length;
    }
    
    function readJobDetails(uint jobid)
    public
    constant
    returns(uint8 jobType, string jobDescription, bool isFilled, uint numberOfApplicants)
    {
        require(jobid < openings.length);
        string memory desc = "iOS Developer"; // if job type is 1!
        if (openings[jobid].jobType == 2) {
            desc = "Android Developer";
        } else if (openings[jobid].jobType == 3) {
            desc = "Java Developer";
        } else if (openings[jobid].jobType == 4) {
          desc = "Blockchain Developer";
        }
        
        return(openings[jobid].jobType,desc,openings[jobid].isFilled,openings[jobid].numberOfApplicants);
    }
    
    function isTalioOwner()
    public onlyIfTalioOwner()
    constant
    returns(bool)
    {
        return true;
    }
    
    function isAuthorizedInterviewer(uint8 jobType)
    public
    constant
    returns(bool)
    {
        require(interviewers[jobType] == msg.sender);
        return true;
    }
 
}