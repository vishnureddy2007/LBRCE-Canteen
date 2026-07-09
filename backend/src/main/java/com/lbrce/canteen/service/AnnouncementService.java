package com.lbrce.canteen.service;

import com.lbrce.canteen.dto.AnnouncementRequest;
import com.lbrce.canteen.dto.AnnouncementResponse;
import com.lbrce.canteen.entity.Admin;
import com.lbrce.canteen.entity.Announcement;
import com.lbrce.canteen.exception.NotFoundException;
import com.lbrce.canteen.repository.AdminRepository;
import com.lbrce.canteen.repository.AnnouncementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final AdminRepository adminRepository;
    private final DtoMapper mapper;

    public AnnouncementService(AnnouncementRepository announcementRepository,
                               AdminRepository adminRepository,
                               DtoMapper mapper) {
        this.announcementRepository = announcementRepository;
        this.adminRepository = adminRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> active() {
        return announcementRepository.findActive(Instant.now())
                .stream().map(mapper::toAnnouncement).toList();
    }

    @Transactional
    public AnnouncementResponse create(AnnouncementRequest req, Long createdById) {
        Announcement a = new Announcement();
        a.setTitle(req.title());
        a.setBody(req.body());
        a.setActive(req.active() == null ? Boolean.TRUE : req.active());
        a.setStartsAt(req.startsAt());
        a.setEndsAt(req.endsAt());
        if (createdById != null) {
            Admin admin = adminRepository.findById(createdById).orElse(null);
            a.setCreatedBy(admin);
        }
        return mapper.toAnnouncement(announcementRepository.save(a));
    }

    @Transactional
    public AnnouncementResponse update(Long id, AnnouncementRequest req) {
        Announcement a = announcementRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Announcement not found: " + id));
        a.setTitle(req.title());
        a.setBody(req.body());
        if (req.active() != null) a.setActive(req.active());
        a.setStartsAt(req.startsAt());
        a.setEndsAt(req.endsAt());
        return mapper.toAnnouncement(a);
    }

    @Transactional
    public void delete(Long id) {
        if (!announcementRepository.existsById(id)) throw new NotFoundException("Announcement not found: " + id);
        announcementRepository.deleteById(id);
    }
}