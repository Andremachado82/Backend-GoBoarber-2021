import { Request, Response } from 'express'
import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";
import { container } from "tsyringe";

export default class AppointmentsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id
    const { provider_id, date } = req.body

    const createAppointment = container.resolve(CreateAppointmentService)

    const appointment = await createAppointment.execute({ date, provider_id, user_id })

    return res.json(appointment)
  }
}